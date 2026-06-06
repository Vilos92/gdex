/*
 * Types.
 */

export type KeyAction = 'moveUp' | 'moveDown' | 'zoomIn' | 'zoomOut' | 'goBack';

export type ChromeKeyAction = 'toggleSidebar' | 'nextWorkspace' | 'prevWorkspace' | 'cycleTheme';

export type KeyBinding = {
  readonly tinykey: string;
  readonly action: KeyAction;
};

export type ChromeKeyBinding = {
  readonly tinykey: string;
  readonly action: ChromeKeyAction;
};

/*
 * Constants.
 */

export const KEY_BINDINGS: readonly KeyBinding[] = [
  {tinykey: 'k', action: 'moveUp'},
  {tinykey: 'ArrowUp', action: 'moveUp'},
  {tinykey: 'j', action: 'moveDown'},
  {tinykey: 'ArrowDown', action: 'moveDown'},
  {tinykey: 'l', action: 'zoomIn'},
  {tinykey: 'ArrowRight', action: 'zoomIn'},
  {tinykey: 'h', action: 'zoomOut'},
  {tinykey: 'ArrowLeft', action: 'zoomOut'},
  {tinykey: 'Backspace', action: 'goBack'}
] as const;

/**
 * macOS: Cmd+B, Cmd+Shift+]/[, Cmd+Option+T.
 * $mod = Meta on Mac, Control on Windows/Linux.
 * KeyT (not t) so Option+T matches via event.code on Mac.
 */
export const CHROME_KEY_BINDINGS: readonly ChromeKeyBinding[] = [
  {tinykey: '$mod+b', action: 'toggleSidebar'},
  {tinykey: '$mod+Shift+]', action: 'nextWorkspace'},
  {tinykey: '$mod+Shift+[', action: 'prevWorkspace'},
  {tinykey: '$mod+Alt+KeyT', action: 'cycleTheme'}
] as const;
