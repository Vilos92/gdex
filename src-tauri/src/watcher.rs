//! Watch workspace storage paths and emit `tasks-changed` when task data updates.

use std::path::Path;
use std::time::Duration;

use notify_debouncer_mini::notify::RecursiveMode;
use notify_debouncer_mini::{new_debouncer, DebounceEventResult, Debouncer};
use tauri::{AppHandle, Emitter};

use crate::workspace_store::Workspace;

const DEBOUNCE_MS: u64 = 30;
const EVENT_TASKS_CHANGED: &str = "tasks-changed";

/* Types. */

/// Keeps filesystem debouncers alive for the app lifetime; dropping stops watches.
pub struct TaskWatcher {
    _debouncers: Vec<Debouncer<notify_debouncer_mini::notify::RecommendedWatcher>>,
}

/* Task watcher. */

impl TaskWatcher {
    pub fn new(app: AppHandle, workspaces: Vec<Workspace>) -> Result<Self, String> {
        let mut debouncers = Vec::with_capacity(workspaces.len());

        for workspace in workspaces {
            match watch_workspace_storage(&app, &workspace) {
                Ok(debouncer) => debouncers.push(debouncer),
                Err(error) => eprintln!(
                    "task watcher: skipping workspace {} ({}): {error}",
                    workspace.id, workspace.storage_path
                ),
            }
        }

        Ok(Self {
            _debouncers: debouncers,
        })
    }
}

/* Helpers. */

fn watch_workspace_storage(
    app: &AppHandle,
    workspace: &Workspace,
) -> Result<Debouncer<notify_debouncer_mini::notify::RecommendedWatcher>, String> {
    let storage_path = workspace.storage_path.as_str();
    let path = Path::new(storage_path);
    if !path.exists() {
        return Err(format!(
            "task watcher: storage path does not exist: {storage_path}"
        ));
    }

    let workspace_id = workspace.id.clone();
    let app = app.clone();
    let mut debouncer = new_debouncer(
        Duration::from_millis(DEBOUNCE_MS),
        move |result: DebounceEventResult| {
            match result {
                Ok(events) => {
                    if !events.is_empty() {
                        if let Err(error) = app.emit(EVENT_TASKS_CHANGED, workspace_id.clone()) {
                            eprintln!(
                                "task watcher: emit {EVENT_TASKS_CHANGED} for workspace {workspace_id}: {error}"
                            );
                        }
                    }
                }
                Err(error) => eprintln!(
                    "task watcher: debounce error for workspace {workspace_id}: {error}"
                ),
            }
        },
    )
    .map_err(|error| format!("task watcher debouncer for {storage_path}: {error}"))?;

    debouncer
        .watcher()
        .watch(path, RecursiveMode::Recursive)
        .map_err(|error| format!("task watcher: watch {storage_path}: {error}"))?;

    Ok(debouncer)
}
