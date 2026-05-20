use std::path::PathBuf;
use thiserror::Error;
use which::which;

/* Types. */

/// Absolute path to the `dex` CLI binary, resolved once at app startup.
#[allow(dead_code)] // consumed by DexClient in a later milestone
pub(crate) struct DexBinaryPath(pub PathBuf);

#[derive(Debug, Error)]
pub(crate) enum ResolveDexBinaryError {
    #[error("failed to locate `dex` on PATH: {0}")]
    LookupFailed(#[from] which::Error),
    #[error(
        "dex CLI not found on PATH. Install dex and ensure it is on your PATH, then restart gdex."
    )]
    NotFound,
}

/* Helpers. */

/// Resolves `dex` on PATH (cross-platform) so GUI launches with a minimal PATH can still find the binary.
pub(crate) fn resolve_dex_binary_path() -> Result<PathBuf, ResolveDexBinaryError> {
    match which("dex") {
        Ok(path) => Ok(path),
        Err(which::Error::CannotFindBinaryPath) => Err(ResolveDexBinaryError::NotFound),
        Err(error) => Err(ResolveDexBinaryError::LookupFailed(error)),
    }
}
