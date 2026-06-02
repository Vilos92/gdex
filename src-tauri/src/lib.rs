mod commands;
mod dex;
mod dex_client;
mod theme_store;
mod watcher;
mod workspace_store;

use std::path::PathBuf;

use dex::resolve_dex_binary_path;
use dex_client::DexClient;
use tauri::Manager;
use tauri_plugin_dialog::{DialogExt, MessageDialogKind};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .setup(|app| {
            let dex_path = match resolve_dex_binary_path() {
                Ok(path) => path,
                Err(error) => {
                    app.dialog()
                        .message(format!(
                            "{error}\n\nInstall the dex CLI and restart gdex, or set DEX_BINARY to its full path."
                        ))
                        .title("Dex not found")
                        .kind(MessageDialogKind::Warning)
                        .show(|_| {});
                    // Placeholder so the app can open; dex commands return a clear error until dex is installed.
                    PathBuf::from("dex")
                }
            };
            app.manage(DexClient::new(dex_path));

            let task_watcher = watcher::TaskWatcher::new(app.handle().clone());
            for workspace in workspace_store::list_workspaces(app.handle())? {
                if let Err(error) = task_watcher.register_workspace(&workspace) {
                    eprintln!(
                        "task watcher: skipping workspace {} ({}): {error}",
                        workspace.id, workspace.storage_path
                    );
                }
            }
            app.manage(task_watcher);

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            commands::validate_workspace,
            commands::add_workspace,
            commands::remove_workspace,
            commands::list_workspaces,
            commands::set_active_workspace,
            commands::get_active_workspace,
            commands::get_tasks,
            commands::get_task,
            commands::get_theme_mode,
            commands::set_theme_mode,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
