use std::env;
use std::ffi::OsString;
use std::path::{Path, PathBuf};
use thiserror::Error;
use which::which_in;

const DEX_BINARY_ENV: &str = "DEX_BINARY";

#[derive(Debug, Error)]
pub(crate) enum ResolveDexBinaryError {
    #[error("failed to read current directory: {0}")]
    CurrentDir(#[from] std::io::Error),
    #[error("failed to locate `dex` on PATH: {0}")]
    LookupFailed(#[from] which::Error),
    #[error(
        "`{path}` from {env_var} is not an executable file. Set {env_var} to the full path of the dex binary."
    )]
    EnvNotExecutable {
        env_var: &'static str,
        path: PathBuf,
    },
    #[error(
        "dex CLI not found. Install dex and ensure it is on your PATH, or set {env_var} to its full path, then restart gdex."
    )]
    NotFound { env_var: &'static str },
}

/* Helpers. */

/// Resolves `dex` for GUI launches where macOS provides a minimal `PATH`.
pub(crate) fn resolve_dex_binary_path() -> Result<PathBuf, ResolveDexBinaryError> {
    if let Ok(path) = env::var(DEX_BINARY_ENV) {
        let path = PathBuf::from(path);
        return validate_executable(&path).map_err(|_| ResolveDexBinaryError::EnvNotExecutable {
            env_var: DEX_BINARY_ENV,
            path,
        });
    }

    let search_path = gui_augmented_path();
    match which_in("dex", Some(search_path.as_os_str()), env::current_dir()?) {
        Ok(path) => Ok(path),
        Err(which::Error::CannotFindBinaryPath) => Err(ResolveDexBinaryError::NotFound {
            env_var: DEX_BINARY_ENV,
        }),
        Err(error) => Err(ResolveDexBinaryError::LookupFailed(error)),
    }
}

/// PATH plus common install locations when the app is opened from Finder/DMG (not a login shell).
fn gui_augmented_path() -> OsString {
    let mut dirs: Vec<PathBuf> = env::var_os("PATH")
        .map(|path| env::split_paths(&path).collect())
        .unwrap_or_default();

    append_search_dir(&mut dirs, "/opt/homebrew/bin");
    append_search_dir(&mut dirs, "/usr/local/bin");
    append_search_dir(&mut dirs, "/usr/bin");
    append_search_dir(&mut dirs, "/bin");

    if let Some(home) = dirs::home_dir() {
        append_search_dir(&mut dirs, home.join(".bun/bin"));
        append_search_dir(&mut dirs, home.join(".cargo/bin"));
        append_search_dir(&mut dirs, home.join(".local/bin"));
    }

    env::join_paths(dirs).unwrap_or_else(|_| OsString::from("/usr/bin:/bin"))
}

fn append_search_dir(dirs: &mut Vec<PathBuf>, dir: impl Into<PathBuf>) {
    let dir = dir.into();
    if dir.as_os_str().is_empty() {
        return;
    }
    if dirs.iter().any(|existing| existing == &dir) {
        return;
    }
    dirs.push(dir);
}

fn validate_executable(path: &Path) -> Result<PathBuf, ()> {
    if !path.is_file() {
        return Err(());
    }

    #[cfg(unix)]
    {
        use std::os::unix::fs::PermissionsExt;
        let mode = path.metadata().map_err(|_| ())?.permissions().mode();
        if mode & 0o111 == 0 {
            return Err(());
        }
    }

    Ok(path.to_path_buf())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn gui_augmented_path_includes_homebrew_and_cargo_bin() {
        let path = gui_augmented_path();
        let joined = path.to_string_lossy();
        assert!(joined.contains("/opt/homebrew/bin"));
        assert!(joined.contains("/usr/local/bin"));
        if let Some(home) = dirs::home_dir() {
            let bun_bin = home.join(".bun/bin");
            assert!(joined.contains(&bun_bin.to_string_lossy().to_string()));
            let cargo_bin = home.join(".cargo/bin");
            assert!(joined.contains(&cargo_bin.to_string_lossy().to_string()));
        }
    }
}
