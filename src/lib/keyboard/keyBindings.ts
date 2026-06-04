/*
 * Types.
 */

export type KeyAction = 'moveUp' | 'moveDown' | 'zoomIn' | 'zoomOut' | 'goBack';

export type KeyBinding = {
  readonly tinykey: string;
  readonly action: KeyAction;
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
