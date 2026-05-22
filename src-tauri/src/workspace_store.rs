//! Persisted dex workspace registry and active workspace selection (`settings.json`).

use std::path::PathBuf;
use std::sync::{
    atomic::{AtomicU64, Ordering},
    Arc, Mutex,
};
use std::time::{SystemTime, UNIX_EPOCH};

use serde::{Deserialize, Serialize};
use tauri::AppHandle;
use tauri_plugin_store::StoreExt;

use crate::dex_client::DexProject;

const STORE_FILE: &str = "settings.json";
const WORKSPACES_KEY: &str = "workspaces";
const ACTIVE_WORKSPACE_KEY: &str = "active_workspace_id";

static STORE_WRITE_MUTEX: Mutex<()> = Mutex::new(());

/* Types. */

/// User-registered dex workspace (config + storage paths passed to every `dex` invocation).
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Workspace {
    pub id: String,
    pub name: String,
    pub config_path: String,
    pub storage_path: String,
}

/* Workspace store. */

pub fn add_workspace(
    app: &AppHandle,
    name: String,
    config_path: String,
    storage_path: String,
) -> Result<Workspace, String> {
    let _guard = store_write_lock()?;
    let store = open_store(app)?;
    let mut workspaces = load_workspaces(&store)?;
    let workspace = Workspace {
        id: new_workspace_id(),
        name,
        config_path,
        storage_path,
    };
    workspaces.push(workspace.clone());
    save_workspaces(&store, &workspaces)?;
    Ok(workspace)
}

pub fn remove_workspace(app: &AppHandle, id: &str) -> Result<(), String> {
    let _guard = store_write_lock()?;
    let store = open_store(app)?;
    let mut workspaces = load_workspaces(&store)?;
    let before = workspaces.len();
    workspaces.retain(|workspace| workspace.id != id);
    if workspaces.len() == before {
        return Err(format!("workspace not found: {id}"));
    }
    if load_active_workspace_id(&store)? == Some(id.to_owned()) {
        store.delete(ACTIVE_WORKSPACE_KEY);
    }
    save_workspaces(&store, &workspaces)?;
    Ok(())
}

pub fn list_workspaces(app: &AppHandle) -> Result<Vec<Workspace>, String> {
    let store = open_store(app)?;
    load_workspaces(&store)
}

pub fn set_active_workspace(app: &AppHandle, id: &str) -> Result<(), String> {
    let _guard = store_write_lock()?;
    let store = open_store(app)?;
    if !load_workspaces(&store)?
        .iter()
        .any(|workspace| workspace.id == id)
    {
        return Err(format!("workspace not found: {id}"));
    }
    store.set(
        ACTIVE_WORKSPACE_KEY,
        serde_json::Value::String(id.to_owned()),
    );
    store.save().map_err(|error| error.to_string())
}

pub fn get_active_workspace(app: &AppHandle) -> Result<Option<String>, String> {
    let store = open_store(app)?;
    load_active_workspace_id(&store)
}

pub fn dex_workspace_for_id(app: &AppHandle, id: &str) -> Result<DexProject, String> {
    let store = open_store(app)?;
    let workspaces = load_workspaces(&store)?;
    let workspace = workspaces
        .iter()
        .find(|workspace| workspace.id == id)
        .ok_or_else(|| format!("workspace not found: {id}"))?;
    Ok(workspace.into())
}

/* Helpers. */

impl From<&Workspace> for DexProject {
    fn from(workspace: &Workspace) -> Self {
        DexProject {
            config_path: PathBuf::from(&workspace.config_path),
            storage_path: PathBuf::from(&workspace.storage_path),
        }
    }
}

type SettingsStore = Arc<tauri_plugin_store::Store<tauri::Wry>>;

fn store_write_lock() -> Result<std::sync::MutexGuard<'static, ()>, String> {
    STORE_WRITE_MUTEX
        .lock()
        .map_err(|_| "workspace store lock poisoned".to_owned())
}

fn open_store(app: &AppHandle) -> Result<SettingsStore, String> {
    app.store(STORE_FILE).map_err(|error| error.to_string())
}

fn load_workspaces(store: &SettingsStore) -> Result<Vec<Workspace>, String> {
    match store.get(WORKSPACES_KEY) {
        Some(value) => serde_json::from_value(value).map_err(|error| error.to_string()),
        None => Ok(Vec::new()),
    }
}

fn save_workspaces(store: &SettingsStore, workspaces: &[Workspace]) -> Result<(), String> {
    let value = serde_json::to_value(workspaces).map_err(|error| error.to_string())?;
    store.set(WORKSPACES_KEY, value);
    store.save().map_err(|error| error.to_string())
}

fn load_active_workspace_id(store: &SettingsStore) -> Result<Option<String>, String> {
    match store.get(ACTIVE_WORKSPACE_KEY) {
        Some(serde_json::Value::String(id)) => Ok(Some(id)),
        Some(_) => Err("active_workspace_id must be a string".to_owned()),
        None => Ok(None),
    }
}

fn new_workspace_id() -> String {
    static COUNTER: AtomicU64 = AtomicU64::new(0);
    let nanos = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_nanos())
        .unwrap_or(0);
    let count = COUNTER.fetch_add(1, Ordering::Relaxed);
    format!("{nanos:x}{count:x}")
}
