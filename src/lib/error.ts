/*
 * Helpers.
 */

/** Display text for a rejected Tauri `invoke` — payloads are `unknown` (Rust string, `Error`, etc.). */
export function invokeErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === 'string') {
    return error;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}
