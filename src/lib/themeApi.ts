import {invoke} from '@tauri-apps/api/core';

import {type ThemeMode, themeModeSchema} from '@/schemas/theme';

/*
 * API.
 */

export async function getThemeMode(): Promise<ThemeMode> {
  const mode = await invoke<unknown>('get_theme_mode');
  return themeModeSchema.parse(mode);
}

export async function setThemeMode(mode: ThemeMode): Promise<void> {
  await invoke('set_theme_mode', {mode});
}
