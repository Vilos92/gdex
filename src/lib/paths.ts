import {open} from '@tauri-apps/plugin-dialog';

/*
 * Helpers.
 */

/** Pick a dex `config.toml` file; returns `undefined` when the dialog is cancelled. */
export async function pickConfigFile(): Promise<string | undefined> {
  const selected = await open({
    multiple: false,
    directory: false,
    filters: [{name: 'TOML', extensions: ['toml']}]
  });
  return normalizeDialogSelection(selected);
}

/** Pick a dex task storage directory; returns `undefined` when the dialog is cancelled. */
export async function pickStorageDirectory(): Promise<string | undefined> {
  const selected = await open({
    multiple: false,
    directory: true
  });
  return normalizeDialogSelection(selected);
}

function normalizeDialogSelection(selected: string | string[] | null): string | undefined {
  if (selected === null) {
    return undefined;
  }
  if (Array.isArray(selected)) {
    return selected[0];
  }
  return selected;
}
