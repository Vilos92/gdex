//! Tauri command handlers — thin bridge to `DexClient` and the workspace store.

use tauri::{AppHandle, State};

use crate::dex_client::{DexClient, DexProject, DexTask};
use crate::theme_store::{self, ThemeMode};
use crate::watcher::TaskWatcher;
use crate::workspace_store::{self, validate_dex_storage_path, Workspace};

#[tauri::command]
pub fn add_workspace(
    app: AppHandle,
    watcher: State<'_, TaskWatcher>,
    name: String,
    config_path: String,
    storage_path: String,
) -> Result<Workspace, String> {
    let workspace = workspace_store::add_workspace(&app, name, config_path, storage_path)?;
    if let Err(error) = watcher.register_workspace(&workspace) {
        if let Err(remove_error) = workspace_store::remove_workspace(&app, &workspace.id) {
            eprintln!(
                "add_workspace: watcher failed for workspace {}; rollback remove failed: {remove_error}",
                workspace.id
            );
        }
        return Err(format!(
            "could not watch workspace storage ({}): {error}",
            workspace.storage_path
        ));
    }
    Ok(workspace)
}

#[tauri::command]
pub fn remove_workspace(
    app: AppHandle,
    watcher: State<'_, TaskWatcher>,
    id: String,
) -> Result<(), String> {
    workspace_store::remove_workspace(&app, &id)?;
    watcher.unregister_workspace(&id);
    Ok(())
}

#[tauri::command]
pub fn list_workspaces(app: AppHandle) -> Result<Vec<Workspace>, String> {
    workspace_store::list_workspaces(&app)
}

#[tauri::command]
pub fn set_active_workspace(app: AppHandle, id: String) -> Result<(), String> {
    workspace_store::set_active_workspace(&app, &id)
}

#[tauri::command]
pub fn get_active_workspace(app: AppHandle) -> Result<Option<String>, String> {
    workspace_store::get_active_workspace(&app)
}

#[tauri::command]
pub fn get_tasks(
    app: AppHandle,
    dex: State<'_, DexClient>,
    workspace_id: String,
) -> Result<Vec<DexTask>, String> {
    let workspace = workspace_store::dex_workspace_for_id(&app, &workspace_id)?;
    dex.list_tasks(&workspace)
        .map_err(|error| error.to_string())
}

#[tauri::command]
pub fn get_task(
    app: AppHandle,
    dex: State<'_, DexClient>,
    workspace_id: String,
    task_id: String,
) -> Result<DexTask, String> {
    let workspace = workspace_store::dex_workspace_for_id(&app, &workspace_id)?;
    dex.show_task(&workspace, &task_id)
        .map_err(|error| error.to_string())
}

/// Validates a proposed workspace before registration.
///
/// Two checks, in order:
/// 1. `storage_path` is an existing dex storage directory containing a `tasks.jsonl` file.
/// 2. A trial `dex list --all --json` using the provided config and `--storage-path`.
///
/// Returns `Ok(())` when both checks pass, or an `Err` with a user-readable description
/// of the first failure.
#[tauri::command]
pub fn validate_workspace(
    dex: State<'_, DexClient>,
    config_path: String,
    storage_path: String,
) -> Result<(), String> {
    // Check 1: dex storage directory must exist and contain `tasks.jsonl`.
    validate_dex_storage_path(&storage_path)?;

    // Check 2: trial `dex list --json` must succeed with these paths.
    let project = DexProject {
        config_path: config_path.into(),
        storage_path: storage_path.into(),
    };
    dex.list_tasks(&project)
        .map(|_| ())
        .map_err(|error| error.to_string())
}

/// Returns the persisted theme mode for the app.
#[tauri::command]
pub fn get_theme_mode(app: AppHandle) -> Result<ThemeMode, String> {
    theme_store::get_theme_mode(&app)
}

/// Persists the user's selected theme mode.
#[tauri::command]
pub fn set_theme_mode(app: AppHandle, mode: ThemeMode) -> Result<(), String> {
    theme_store::set_theme_mode(&app, mode)
}
