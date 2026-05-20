//! Persisted dex project registry and active project selection (`settings.json`).

use std::path::PathBuf;
use std::sync::{
    atomic::{AtomicU64, Ordering},
    Arc,
};
use std::time::{SystemTime, UNIX_EPOCH};

use serde::{Deserialize, Serialize};
use tauri::AppHandle;
use tauri_plugin_store::StoreExt;

use crate::dex_client::DexProject;

const STORE_FILE: &str = "settings.json";
const PROJECTS_KEY: &str = "projects";
const ACTIVE_PROJECT_KEY: &str = "active_project_id";

/* Types. */

/// User-registered dex project (config + storage paths passed to every `dex` invocation).
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Project {
    pub id: String,
    pub name: String,
    pub config_path: String,
    pub storage_path: String,
}

/* Project store. */

pub fn add_project(
    app: &AppHandle,
    name: String,
    config_path: String,
    storage_path: String,
) -> Result<Project, String> {
    let store = open_store(app)?;
    let mut projects = load_projects(&store)?;
    let project = Project {
        id: new_project_id(),
        name,
        config_path,
        storage_path,
    };
    projects.push(project.clone());
    save_projects(&store, &projects)?;
    Ok(project)
}

pub fn remove_project(app: &AppHandle, id: &str) -> Result<(), String> {
    let store = open_store(app)?;
    let mut projects = load_projects(&store)?;
    let before = projects.len();
    projects.retain(|project| project.id != id);
    if projects.len() == before {
        return Err(format!("project not found: {id}"));
    }
    save_projects(&store, &projects)?;
    if load_active_project_id(&store)? == Some(id.to_owned()) {
        store.delete(ACTIVE_PROJECT_KEY);
        store.save().map_err(|error| error.to_string())?;
    }
    Ok(())
}

pub fn list_projects(app: &AppHandle) -> Result<Vec<Project>, String> {
    let store = open_store(app)?;
    load_projects(&store)
}

pub fn set_active_project(app: &AppHandle, id: &str) -> Result<(), String> {
    let store = open_store(app)?;
    if !load_projects(&store)?
        .iter()
        .any(|project| project.id == id)
    {
        return Err(format!("project not found: {id}"));
    }
    store.set(ACTIVE_PROJECT_KEY, serde_json::Value::String(id.to_owned()));
    store.save().map_err(|error| error.to_string())
}

pub fn get_active_project(app: &AppHandle) -> Result<Option<String>, String> {
    let store = open_store(app)?;
    load_active_project_id(&store)
}

pub fn dex_project_for_id(app: &AppHandle, id: &str) -> Result<DexProject, String> {
    let store = open_store(app)?;
    let projects = load_projects(&store)?;
    let project = projects
        .iter()
        .find(|project| project.id == id)
        .ok_or_else(|| format!("project not found: {id}"))?;
    Ok(project.into())
}

/* Helpers. */

impl From<&Project> for DexProject {
    fn from(project: &Project) -> Self {
        DexProject {
            config_path: PathBuf::from(&project.config_path),
            storage_path: PathBuf::from(&project.storage_path),
        }
    }
}

type SettingsStore = Arc<tauri_plugin_store::Store<tauri::Wry>>;

fn open_store(app: &AppHandle) -> Result<SettingsStore, String> {
    app.store(STORE_FILE).map_err(|error| error.to_string())
}

fn load_projects(store: &SettingsStore) -> Result<Vec<Project>, String> {
    match store.get(PROJECTS_KEY) {
        Some(value) => serde_json::from_value(value).map_err(|error| error.to_string()),
        None => Ok(Vec::new()),
    }
}

fn save_projects(store: &SettingsStore, projects: &[Project]) -> Result<(), String> {
    let value = serde_json::to_value(projects).map_err(|error| error.to_string())?;
    store.set(PROJECTS_KEY, value);
    store.save().map_err(|error| error.to_string())
}

fn load_active_project_id(store: &SettingsStore) -> Result<Option<String>, String> {
    match store.get(ACTIVE_PROJECT_KEY) {
        Some(serde_json::Value::String(id)) => Ok(Some(id)),
        Some(_) => Err("active_project_id must be a string".to_owned()),
        None => Ok(None),
    }
}

fn new_project_id() -> String {
    static COUNTER: AtomicU64 = AtomicU64::new(0);
    let nanos = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_nanos())
        .unwrap_or(0);
    let count = COUNTER.fetch_add(1, Ordering::Relaxed);
    format!("{nanos:x}{count:x}")
}
