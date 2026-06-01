//! Persisted UI theme mode (`settings.json`).

use serde::{Deserialize, Serialize};
use tauri::AppHandle;

use crate::workspace_store::{open_store, store_write_lock};

const THEME_MODE_KEY: &str = "theme_mode";

/* Types. */

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum ThemeMode {
    Light,
    Dark,
    Auto,
}

/* Theme store. */

pub fn get_theme_mode(app: &AppHandle) -> Result<ThemeMode, String> {
    let store = open_store(app)?;
    match store.get(THEME_MODE_KEY) {
        Some(value) => serde_json::from_value(value).map_err(|error| error.to_string()),
        None => Ok(ThemeMode::Auto),
    }
}

pub fn set_theme_mode(app: &AppHandle, mode: ThemeMode) -> Result<(), String> {
    let _guard = store_write_lock()?;
    let store = open_store(app)?;
    let value = serde_json::to_value(mode).map_err(|error| error.to_string())?;
    store.set(THEME_MODE_KEY, value);
    store.save().map_err(|error| error.to_string())
}
