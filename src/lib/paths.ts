import {open} from '@tauri-apps/plugin-dialog';

/*
 * Helpers.
 */

export async function pickConfigFile(): Promise<string | undefined> {
  const selected = await open({
    multiple: false,
    directory: false,
    filters: [{name: 'TOML', extensions: ['toml']}]
  });
  return normalizeDialogSelection(selected);
}

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
