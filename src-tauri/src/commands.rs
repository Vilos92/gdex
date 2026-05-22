//! Tauri command handlers — thin bridge to `DexClient` and the workspace store.

use tauri::{AppHandle, State};

use crate::dex_client::{DexClient, DexTask};
use crate::watcher::TaskWatcher;
use crate::workspace_store::{self, Workspace};

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
