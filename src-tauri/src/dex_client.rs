//! Read-only `dex` CLI client; Tauri commands will call `list_tasks` / `show_task`.
#![allow(dead_code)]

use std::io::{ErrorKind, Read};
use std::path::{Path, PathBuf};
use std::process::{Command, Stdio};
use std::time::{Duration, Instant};

use serde::{Deserialize, Serialize};
use thiserror::Error;

const DEX_COMMAND_TIMEOUT: Duration = Duration::from_secs(30);

/* Types. */

/// Registered dex project: config file and task storage directory passed to every CLI invocation.
pub struct DexProject {
    pub config_path: PathBuf,
    pub storage_path: PathBuf,
}

/// Shells out to the resolved `dex` binary for read-only task queries.
pub struct DexClient {
    binary_path: PathBuf,
}

/// Task record from `dex list --json` / `dex show <id> --json` (extra show-only keys are ignored).
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Task {
    pub id: String,
    pub parent_id: Option<String>,
    pub name: String,
    pub description: Option<String>,
    pub priority: i32,
    pub completed: bool,
    pub result: Option<String>,
    pub started_at: Option<String>,
    pub completed_at: Option<String>,
    pub children: Vec<String>,
    #[serde(rename = "blockedBy")]
    pub blocked_by: Vec<String>,
}

#[derive(Debug, Error)]
pub enum DexError {
    #[error("dex binary not found at `{}`", path.display())]
    BinaryNotFound { path: PathBuf },

    #[error("failed to run dex: {0}")]
    Io(#[from] std::io::Error),

    #[error("dex exited with status {status}: {stderr}")]
    CommandFailed { status: i32, stderr: String },

    #[error(
        "dex command timed out after {timeout_secs}s (binary: `{binary}`; config: `{config}`; storage: `{storage}`)"
    )]
    CommandTimedOut {
        timeout_secs: u64,
        binary: PathBuf,
        config: PathBuf,
        storage: PathBuf,
    },

    #[error("failed to parse dex JSON output: {0}")]
    Parse(#[from] serde_json::Error),
}

impl Serialize for DexError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        serializer.serialize_str(&self.to_string())
    }
}

/* DexClient. */

impl DexClient {
    pub fn new(binary_path: PathBuf) -> Self {
        Self { binary_path }
    }

    pub fn list_tasks(&self, project: &DexProject) -> Result<Vec<Task>, DexError> {
        let stdout = self.run_dex(project, &["list", "--json"])?;
        serde_json::from_str(&stdout).map_err(DexError::from)
    }

    pub fn show_task(&self, project: &DexProject, id: &str) -> Result<Task, DexError> {
        let stdout = self.run_dex(project, &["show", id, "--json"])?;
        serde_json::from_str(&stdout).map_err(DexError::from)
    }
}

/* Helpers. */

impl DexClient {
    fn run_dex(&self, project: &DexProject, args: &[&str]) -> Result<String, DexError> {
        let mut child = Command::new(&self.binary_path)
            .arg("--config")
            .arg(&project.config_path)
            .arg("--storage-path")
            .arg(&project.storage_path)
            .args(args)
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .spawn()
            .map_err(|error| map_spawn_error(error, &self.binary_path))?;

        let deadline = Instant::now() + DEX_COMMAND_TIMEOUT;
        let status = loop {
            match child.try_wait().map_err(DexError::Io)? {
                Some(status) => break status,
                None if Instant::now() >= deadline => {
                    let _ = child.kill();
                    let _ = child.wait();
                    return Err(DexError::CommandTimedOut {
                        timeout_secs: DEX_COMMAND_TIMEOUT.as_secs(),
                        binary: self.binary_path.clone(),
                        config: project.config_path.clone(),
                        storage: project.storage_path.clone(),
                    });
                }
                None => std::thread::sleep(Duration::from_millis(50)),
            }
        };

        let mut stdout = Vec::new();
        let mut stderr = Vec::new();
        if let Some(mut pipe) = child.stdout.take() {
            pipe.read_to_end(&mut stdout).map_err(DexError::Io)?;
        }
        if let Some(mut pipe) = child.stderr.take() {
            pipe.read_to_end(&mut stderr).map_err(DexError::Io)?;
        }

        if status.success() {
            return Ok(String::from_utf8_lossy(&stdout).into_owned());
        }

        Err(DexError::CommandFailed {
            status: status.code().unwrap_or(-1),
            stderr: String::from_utf8_lossy(&stderr).into_owned(),
        })
    }
}

fn map_spawn_error(error: std::io::Error, binary_path: &Path) -> DexError {
    if error.kind() == ErrorKind::NotFound {
        DexError::BinaryNotFound {
            path: binary_path.to_path_buf(),
        }
    } else {
        DexError::Io(error)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::path::PathBuf;

    const LIST_ROW_JSON: &str = r#"{
        "id": "xrc0mxfb",
        "parent_id": "ia40wzb6",
        "name": "DexClient (Rust)",
        "description": "read-only dex shell client",
        "priority": 1,
        "completed": false,
        "result": null,
        "started_at": null,
        "completed_at": null,
        "blockedBy": ["blocker-a"],
        "children": ["child-a"]
    }"#;

    /// Set `GDEX_TEST_DEX_CONFIG` and `GDEX_TEST_DEX_STORAGE` to run integration tests locally.
    fn integration_project_from_env() -> Option<DexProject> {
        let config_path = std::env::var_os("GDEX_TEST_DEX_CONFIG").map(PathBuf::from)?;
        let storage_path = std::env::var_os("GDEX_TEST_DEX_STORAGE").map(PathBuf::from)?;
        Some(DexProject {
            config_path,
            storage_path,
        })
    }

    fn sample_project() -> DexProject {
        DexProject {
            config_path: PathBuf::from("/tmp/gdex-test/config.toml"),
            storage_path: PathBuf::from("/tmp/gdex-test/storage"),
        }
    }

    #[test]
    fn deserializes_task_from_dex_json() {
        let task: Task = serde_json::from_str(LIST_ROW_JSON).expect("task JSON");
        assert_eq!(task.id, "xrc0mxfb");
        assert_eq!(task.parent_id, Some("ia40wzb6".to_owned()));
        assert_eq!(task.blocked_by, vec!["blocker-a".to_owned()]);
        assert_eq!(task.children, vec!["child-a".to_owned()]);
    }

    #[test]
    fn list_tasks_errors_when_binary_missing() {
        let client = DexClient::new(PathBuf::from("/nonexistent/gdex-dex-binary"));
        let error = client
            .list_tasks(&sample_project())
            .expect_err("missing binary");
        assert!(matches!(error, DexError::BinaryNotFound { .. }));
    }

    #[test]
    #[ignore = "requires dex on PATH and GDEX_TEST_DEX_CONFIG / GDEX_TEST_DEX_STORAGE"]
    fn list_tasks_returns_tasks() {
        let project = integration_project_from_env().expect("integration env vars");
        let client = DexClient::new(which::which("dex").expect("dex on PATH"));
        let tasks = client.list_tasks(&project).expect("dex list --json");
        assert!(!tasks.is_empty());
    }

    #[test]
    #[ignore = "requires dex on PATH, GDEX_TEST_DEX_* env vars, and GDEX_TEST_DEX_TASK_ID"]
    fn show_task_returns_detail() {
        let project = integration_project_from_env().expect("integration env vars");
        let task_id = std::env::var("GDEX_TEST_DEX_TASK_ID").expect("GDEX_TEST_DEX_TASK_ID");
        let client = DexClient::new(which::which("dex").expect("dex on PATH"));
        let task = client
            .show_task(&project, &task_id)
            .expect("dex show --json");
        assert_eq!(task.id, task_id);
    }
}
