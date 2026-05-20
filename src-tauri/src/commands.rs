//! Tauri command handlers — thin bridge to `DexClient` and the project store.

use tauri::{AppHandle, State};

use crate::dex_client::{DexClient, Task};
use crate::project_store::{self, Project};

#[tauri::command]
pub fn add_project(
    app: AppHandle,
    name: String,
    config_path: String,
    storage_path: String,
) -> Result<Project, String> {
    project_store::add_project(&app, name, config_path, storage_path)
}

#[tauri::command]
pub fn remove_project(app: AppHandle, id: String) -> Result<(), String> {
    project_store::remove_project(&app, &id)
}

#[tauri::command]
pub fn list_projects(app: AppHandle) -> Result<Vec<Project>, String> {
    project_store::list_projects(&app)
}

#[tauri::command]
pub fn set_active_project(app: AppHandle, id: String) -> Result<(), String> {
    project_store::set_active_project(&app, &id)
}

#[tauri::command]
pub fn get_active_project(app: AppHandle) -> Result<Option<String>, String> {
    project_store::get_active_project(&app)
}

#[tauri::command]
pub fn get_tasks(
    app: AppHandle,
    dex: State<'_, DexClient>,
    project_id: String,
) -> Result<Vec<Task>, String> {
    let project = project_store::dex_project_for_id(&app, &project_id)?;
    dex.list_tasks(&project).map_err(|error| error.to_string())
}

#[tauri::command]
pub fn get_task(
    app: AppHandle,
    dex: State<'_, DexClient>,
    project_id: String,
    task_id: String,
) -> Result<Task, String> {
    let project = project_store::dex_project_for_id(&app, &project_id)?;
    dex.show_task(&project, &task_id)
        .map_err(|error| error.to_string())
}
