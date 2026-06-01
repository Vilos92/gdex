import {getCurrentWindow} from '@tauri-apps/api/window';

import {getThemeMode, setThemeMode} from '@/lib/themeApi';
import type {ResolvedTheme, ThemeMode} from '@/schemas/theme';

/*
 * Constants.
 */

const THEME_MODE_CACHE_KEY = 'gdex-theme-mode';

const THEME_MODE_CYCLE: readonly ThemeMode[] = ['light', 'dark', 'auto'];

/*
 * Helpers.
 */

function prefersDarkColorScheme(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function resolveTheme(mode: ThemeMode): ResolvedTheme {
  if (mode === 'light') {
    return 'light';
  }
  if (mode === 'dark') {
    return 'dark';
  }
  return prefersDarkColorScheme() ? 'dark' : 'light';
}

export function readThemeModeCache(): ThemeMode | undefined {
  const raw = localStorage.getItem(THEME_MODE_CACHE_KEY);
  if (raw === 'light' || raw === 'dark' || raw === 'auto') {
    return raw;
  }
  return undefined;
}

function writeThemeModeCache(mode: ThemeMode): void {
  localStorage.setItem(THEME_MODE_CACHE_KEY, mode);
}

function applyResolvedTheme(resolved: ResolvedTheme): void {
  document.documentElement.dataset.theme = resolved;
}

export function nextThemeMode(mode: ThemeMode): ThemeMode {
  const index = THEME_MODE_CYCLE.indexOf(mode);
  const nextIndex = index === -1 ? 0 : (index + 1) % THEME_MODE_CYCLE.length;
  const next = THEME_MODE_CYCLE[nextIndex];
  if (next === undefined) {
    throw new Error('theme mode cycle is empty');
  }
  return next;
}

function themeModeLabel(mode: ThemeMode): string {
  if (mode === 'light') {
    return 'Light';
  }
  if (mode === 'dark') {
    return 'Dark';
  }
  return 'Auto';
}

export function themeToggleAriaLabel(mode: ThemeMode): string {
  const next = nextThemeMode(mode);
  return `Theme: ${themeModeLabel(mode)}. Activate for ${themeModeLabel(next)}.`;
}

export async function syncNativeWindowTheme(mode: ThemeMode, resolved: ResolvedTheme): Promise<void> {
  try {
    const window = getCurrentWindow();
    if (mode === 'auto') {
      await window.setTheme(null);
      return;
    }
    await window.setTheme(resolved);
  } catch {
    // Vite dev in a plain browser has no Tauri window APIs.
  }
}

export function applyThemeMode(mode: ThemeMode): ResolvedTheme {
  const resolved = resolveTheme(mode);
  applyResolvedTheme(resolved);
  writeThemeModeCache(mode);
  return resolved;
}

export async function hydrateThemeFromDisk(): Promise<ThemeMode> {
  const mode = await getThemeMode();
  const resolved = applyThemeMode(mode);
  await syncNativeWindowTheme(mode, resolved);
  return mode;
}

export async function persistThemeMode(mode: ThemeMode): Promise<ResolvedTheme> {
  await setThemeMode(mode);
  const resolved = applyThemeMode(mode);
  await syncNativeWindowTheme(mode, resolved);
  return resolved;
}

export function subscribeToSystemColorScheme(onChange: () => void): () => void {
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const listener = () => onChange();
  media.addEventListener('change', listener);
  return () => media.removeEventListener('change', listener);
}
