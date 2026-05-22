//! Watch workspace storage paths and emit `tasks-changed` when task data updates.

use std::collections::HashMap;
use std::path::Path;
use std::sync::{Arc, Mutex};
use std::time::Duration;

use notify_debouncer_mini::notify::RecursiveMode;
use notify_debouncer_mini::{new_debouncer, DebounceEventResult, Debouncer};
use tauri::{AppHandle, Emitter};

use crate::workspace_store::Workspace;

const DEBOUNCE_MS: u64 = 30;
const EVENT_TASKS_CHANGED: &str = "tasks-changed";

type WatcherDebouncer = Debouncer<notify_debouncer_mini::notify::RecommendedWatcher>;

/* Types. */

/// Keeps filesystem debouncers alive per workspace; register/unregister as the store changes.
pub struct TaskWatcher {
    app: AppHandle,
    debouncers: Arc<Mutex<HashMap<String, WatcherDebouncer>>>,
}

/* Task watcher. */

impl TaskWatcher {
    pub fn new(app: AppHandle) -> Self {
        Self {
            app,
            debouncers: Arc::new(Mutex::new(HashMap::new())),
        }
    }

    pub fn register_workspace(&self, workspace: &Workspace) -> Result<(), String> {
        let mut debouncers = self
            .debouncers
            .lock()
            .map_err(|_| "task watcher lock poisoned".to_owned())?;
        if debouncers.contains_key(&workspace.id) {
            return Ok(());
        }
        let debouncer = watch_workspace_storage(&self.app, workspace)?;
        debouncers.insert(workspace.id.clone(), debouncer);
        Ok(())
    }

    pub fn unregister_workspace(&self, workspace_id: &str) {
        if let Ok(mut debouncers) = self.debouncers.lock() {
            debouncers.remove(workspace_id);
        }
    }
}

/* Helpers. */

fn watch_workspace_storage(
    app: &AppHandle,
    workspace: &Workspace,
) -> Result<WatcherDebouncer, String> {
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
