//! Binary entry point that hands off to the library's `run` function.

// Keeps release builds windowed-only on Windows, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    gdex_lib::run()
}
