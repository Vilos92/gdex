mod commands;
mod dex;
mod dex_client;
mod project_store;

use dex::resolve_dex_binary_path;
use dex_client::DexClient;
use tauri::Manager;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let dex_path = resolve_dex_binary_path()?;
            app.manage(DexClient::new(dex_path));
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            commands::add_project,
            commands::remove_project,
            commands::list_projects,
            commands::set_active_project,
            commands::get_active_project,
            commands::get_tasks,
            commands::get_task,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
