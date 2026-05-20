use std::path::PathBuf;
use std::process::Command;
use thiserror::Error;

/* Types. */

/// Absolute path to the `dex` CLI binary, resolved once at app startup.
#[allow(dead_code)] // consumed by DexClient in a later milestone
pub(crate) struct DexBinaryPath(pub PathBuf);

#[derive(Debug, Error)]
pub(crate) enum ResolveDexBinaryError {
    #[error("failed to run `which dex`: {0}")]
    WhichFailed(std::io::Error),
    #[error(
        "dex CLI not found on PATH. Install dex and ensure it is on your PATH, then restart gdex."
    )]
    NotFound,
    #[error("`which dex` returned invalid UTF-8: {0}")]
    InvalidUtf8(#[from] std::string::FromUtf8Error),
}

/* Helpers. */

/// Resolves `dex` via `which` so GUI launches (minimal PATH) still find the binary when possible.
pub(crate) fn resolve_dex_binary_path() -> Result<PathBuf, ResolveDexBinaryError> {
    let output = Command::new("which")
        .arg("dex")
        .output()
        .map_err(ResolveDexBinaryError::WhichFailed)?;

    if !output.status.success() {
        return Err(ResolveDexBinaryError::NotFound);
    }

    let path = String::from_utf8(output.stdout)?.trim().to_string();
    if path.is_empty() {
        return Err(ResolveDexBinaryError::NotFound);
    }

    Ok(PathBuf::from(path))
}
