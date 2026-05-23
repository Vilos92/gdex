/*
 * Helpers.
 */

/** Copy text via Clipboard API, falling back to `execCommand` when the API is unavailable. */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText !== undefined) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    return copyTextViaExecCommand(text);
  } catch {
    return false;
  }
}

/** Synchronous clipboard fallback when `navigator.clipboard` is unavailable (e.g. non-secure context). */
function copyTextViaExecCommand(text: string): boolean {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();

  try {
    return document.execCommand('copy');
  } finally {
    document.body.removeChild(textarea);
  }
}
