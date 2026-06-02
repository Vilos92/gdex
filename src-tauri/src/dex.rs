use std::env;
use std::ffi::{OsStr, OsString};
use std::fs;
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
    #[error("failed to canonicalize dex path `{path}`: {source}")]
    Canonicalize {
        path: PathBuf,
        #[source]
        source: std::io::Error,
    },
    #[error(
        "dex CLI not found. Install dex and ensure it is on your PATH, or set {env_var} to its full path, then restart gdex."
    )]
    NotFound { env_var: &'static str },
}

/* Helpers. */

/// Resolves `dex` for GUI launches where macOS provides a minimal `PATH`.
pub(crate) fn resolve_dex_binary_path() -> Result<PathBuf, ResolveDexBinaryError> {
    if let Some(path_os) = env::var_os(DEX_BINARY_ENV) {
        let path = PathBuf::from(path_os);
        validate_executable(&path).map_err(|_| ResolveDexBinaryError::EnvNotExecutable {
            env_var: DEX_BINARY_ENV,
            path: path.clone(),
        })?;
        return fs::canonicalize(&path)
            .map_err(|source| ResolveDexBinaryError::Canonicalize { path, source });
    }

    lookup_dex_on_path(gui_augmented_path().as_os_str(), &env::current_dir()?)
}

fn lookup_dex_on_path(search_path: &OsStr, cwd: &Path) -> Result<PathBuf, ResolveDexBinaryError> {
    match which_in("dex", Some(search_path), cwd) {
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
    use std::ffi::OsStr;
    use std::fs;
    use std::sync::Mutex;

    static ENV_LOCK: Mutex<()> = Mutex::new(());

    struct EnvSnapshot {
        dex_binary: Option<OsString>,
        path: Option<OsString>,
    }

    impl EnvSnapshot {
        fn capture() -> Self {
            Self {
                dex_binary: env::var_os(DEX_BINARY_ENV),
                path: env::var_os("PATH"),
            }
        }
    }

    impl Drop for EnvSnapshot {
        fn drop(&mut self) {
            restore_env_var(DEX_BINARY_ENV, self.dex_binary.as_deref());
            restore_env_var("PATH", self.path.as_deref());
        }
    }

    fn restore_env_var(key: &str, value: Option<&OsStr>) {
        match value {
            Some(value) => env::set_var(key, value),
            None => {
                // SAFETY: tests hold ENV_LOCK; no other env access runs concurrently.
                unsafe {
                    env::remove_var(key);
                }
            }
        }
    }

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

    #[test]
    fn resolve_dex_binary_path_uses_dex_binary_env_when_executable() {
        let _guard = ENV_LOCK.lock().expect("env lock");
        let _env = EnvSnapshot::capture();

        let script = env::temp_dir().join("gdex-test-dex-executable");
        fs::write(&script, b"#!/bin/sh\nexit 0\n").expect("write script");
        #[cfg(unix)]
        {
            use std::os::unix::fs::PermissionsExt;
            fs::set_permissions(&script, fs::Permissions::from_mode(0o755)).expect("chmod script");
        }

        env::set_var(DEX_BINARY_ENV, &script);
        let resolved = resolve_dex_binary_path().expect("resolve dex");
        let expected = fs::canonicalize(&script).expect("canonicalize script");
        assert_eq!(resolved, expected);

        let _ = fs::remove_file(script);
    }

    #[cfg(unix)]
    #[test]
    fn resolve_dex_binary_path_errors_when_dex_binary_not_executable() {
        let _guard = ENV_LOCK.lock().expect("env lock");
        let _env = EnvSnapshot::capture();

        let script = env::temp_dir().join("gdex-test-dex-not-executable");
        fs::write(&script, b"not executable\n").expect("write script");
        use std::os::unix::fs::PermissionsExt;
        fs::set_permissions(&script, fs::Permissions::from_mode(0o644)).expect("chmod script");

        env::set_var(DEX_BINARY_ENV, &script);
        let error = resolve_dex_binary_path().expect_err("resolve dex");
        assert!(matches!(
            error,
            ResolveDexBinaryError::EnvNotExecutable { env_var, path }
            if env_var == DEX_BINARY_ENV && path == script
        ));

        let _ = fs::remove_file(script);
    }

    #[test]
    fn not_found_maps_dex_missing_on_path_to_not_found_variant() {
        let _guard = ENV_LOCK.lock().expect("env lock");
        let _env = EnvSnapshot::capture();

        env::remove_var(DEX_BINARY_ENV);
        let error = lookup_dex_on_path(OsStr::new(""), Path::new(".")).expect_err("lookup dex");
        assert!(matches!(
            error,
            ResolveDexBinaryError::NotFound { env_var } if env_var == DEX_BINARY_ENV
        ));
    }
}
