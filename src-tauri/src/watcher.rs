//! Watch project storage paths and emit `tasks-changed` when task data updates.

use std::path::Path;
use std::time::Duration;

use notify_debouncer_mini::notify::RecursiveMode;
use notify_debouncer_mini::{new_debouncer, DebounceEventResult, Debouncer};
use tauri::{AppHandle, Emitter};

use crate::project_store::Project;

const DEBOUNCE_MS: u64 = 30;
const EVENT_TASKS_CHANGED: &str = "tasks-changed";

/* Types. */

/// Keeps filesystem debouncers alive for the app lifetime; dropping stops watches.
pub struct TaskWatcher {
    _debouncers: Vec<Debouncer<notify_debouncer_mini::notify::RecommendedWatcher>>,
}

/* Task watcher. */

impl TaskWatcher {
    pub fn new(app: AppHandle, projects: Vec<Project>) -> Result<Self, String> {
        let mut debouncers = Vec::with_capacity(projects.len());

        for project in projects {
            debouncers.push(watch_project_storage(&app, &project)?);
        }

        Ok(Self {
            _debouncers: debouncers,
        })
    }
}

/* Helpers. */

fn watch_project_storage(
    app: &AppHandle,
    project: &Project,
) -> Result<Debouncer<notify_debouncer_mini::notify::RecommendedWatcher>, String> {
    let storage_path = project.storage_path.as_str();
    let path = Path::new(storage_path);
    if !path.exists() {
        return Err(format!(
            "task watcher: storage path does not exist: {storage_path}"
        ));
    }

    let project_id = project.id.clone();
    let app = app.clone();
    let mut debouncer = new_debouncer(
        Duration::from_millis(DEBOUNCE_MS),
        move |result: DebounceEventResult| {
            if let Ok(events) = result {
                if !events.is_empty() {
                    let _ = app.emit(EVENT_TASKS_CHANGED, project_id.clone());
                }
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
