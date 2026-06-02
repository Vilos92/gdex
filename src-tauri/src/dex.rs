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
pub(crate) fn gui_augmented_path() -> OsString {
    let mut dirs: Vec<PathBuf> = env::var_os("PATH")
        .map(|path| env::split_paths(&path).collect())
        .unwrap_or_default();

    append_search_dir(&mut dirs, "/opt/homebrew/bin");
    append_search_dir(&mut dirs, "/usr/local/bin");
    append_search_dir(&mut dirs, "/usr/bin");
    append_search_dir(&mut dirs, "/bin");

    if let Some(home) = dirs::home_dir() {
        append_search_dir(&mut dirs, home.join(".bun/bin"));
        append_search_dir(&mut dirs, home.join(".volta/bin"));
        append_search_dir(&mut dirs, home.join(".cargo/bin"));
        append_search_dir(&mut dirs, home.join(".local/bin"));
        append_nvm_node_bins(&mut dirs, &home);
    }

    append_search_dir(&mut dirs, "/opt/homebrew/opt/node/bin");

    env::join_paths(dirs).unwrap_or_else(|_| OsString::from("/usr/bin:/bin"))
}

/// Adds `~/.nvm/versions/node/<resolved>/bin` from nvm's default alias when present.
fn append_nvm_node_bins(dirs: &mut Vec<PathBuf>, home: &Path) {
    let default_alias = home.join(".nvm/alias/default");
    let Ok(alias) = fs::read_to_string(&default_alias) else {
        return;
    };
    let alias = alias.trim();
    if alias.is_empty() {
        return;
    }

    let versions_root = home.join(".nvm/versions/node");
    let Some(bin_dir) = resolve_nvm_bin_dir(home, &versions_root, alias) else {
        return;
    };
    append_search_dir(dirs, bin_dir);
}

fn resolve_nvm_bin_dir(home: &Path, versions_root: &Path, alias: &str) -> Option<PathBuf> {
    if let Some(bin) = nvm_bin_for_version_name(versions_root, alias) {
        return Some(bin);
    }
    if let Some(bin) = resolve_nvm_named_alias(home, alias) {
        return Some(bin);
    }
    resolve_nvm_version_match(versions_root, alias)
}

fn nvm_bin_for_version_name(versions_root: &Path, version: &str) -> Option<PathBuf> {
    let trimmed = version.trim_start_matches('v');
    for candidate in [version, trimmed, &format!("v{trimmed}")] {
        let bin = versions_root.join(candidate).join("bin");
        if bin.is_dir() {
            return Some(bin);
        }
    }
    None
}

fn resolve_nvm_named_alias(home: &Path, alias: &str) -> Option<PathBuf> {
    let alias_file = home.join(".nvm/alias").join(alias);
    let Ok(target) = fs::read_to_string(&alias_file) else {
        return None;
    };
    let target = target.trim();
    if target.is_empty() {
        return None;
    }
    let versions_root = home.join(".nvm/versions/node");
    resolve_nvm_bin_dir(home, &versions_root, target)
}

fn resolve_nvm_version_match(versions_root: &Path, pattern: &str) -> Option<PathBuf> {
    let entries = fs::read_dir(versions_root).ok()?;
    let mut matches = Vec::new();
    for entry in entries.flatten() {
        let name = entry.file_name().to_string_lossy().into_owned();
        if nvm_version_matches_pattern(&name, pattern) {
            matches.push(name);
        }
    }
    let best = matches
        .into_iter()
        .max_by(|left, right| nvm_version_dir_cmp(left, right))?;
    nvm_bin_for_version_name(versions_root, &best)
}

fn nvm_version_matches_pattern(version_dir: &str, pattern: &str) -> bool {
    let version_dir = version_dir.trim_start_matches('v');
    let pattern = pattern.trim_start_matches('v');
    if pattern == "lts/*" || pattern == "lts" {
        return version_dir.contains("lts")
            || version_dir
                .chars()
                .next()
                .is_some_and(|c| c.is_ascii_digit());
    }
    version_dir == pattern
        || version_dir.starts_with(&format!("{pattern}."))
        || version_dir.starts_with(pattern)
}

fn nvm_version_dir_cmp(left: &str, right: &str) -> std::cmp::Ordering {
    let left_parts = nvm_version_parts(left);
    let right_parts = nvm_version_parts(right);
    left_parts.cmp(&right_parts)
}

fn nvm_version_parts(version_dir: &str) -> Vec<u64> {
    version_dir
        .trim_start_matches('v')
        .split('.')
        .filter_map(|part| part.parse().ok())
        .collect()
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
            let volta_bin = home.join(".volta/bin");
            assert!(joined.contains(&volta_bin.to_string_lossy().to_string()));
            let cargo_bin = home.join(".cargo/bin");
            assert!(joined.contains(&cargo_bin.to_string_lossy().to_string()));
        }
    }

    #[test]
    fn append_nvm_node_bins_adds_default_version_bin() {
        let home = env::temp_dir().join("gdex-nvm-home");
        let _ = fs::remove_dir_all(&home);
        let version = "20.11.0";
        let bin_dir = home.join(".nvm/versions/node").join(version).join("bin");
        fs::create_dir_all(&bin_dir).expect("create nvm bin dir");
        fs::create_dir_all(home.join(".nvm/alias")).expect("create nvm alias dir");
        fs::write(home.join(".nvm/alias/default"), version).expect("write default alias");

        let mut dirs = Vec::new();
        append_nvm_node_bins(&mut dirs, &home);
        assert!(dirs.iter().any(|dir| dir == &bin_dir));

        let _ = fs::remove_dir_all(home);
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
