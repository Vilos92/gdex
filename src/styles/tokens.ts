/*
 * Constants.
 */

/** App-wide font stacks (`:root` sans + monospace surfaces like code blocks). */
export const fonts = {
  sans: 'Inter, Avenir, Helvetica, Arial, sans-serif',
  mono: 'ui-monospace, "SF Mono", SFMono-Regular, Menlo, Monaco, Consolas, monospace'
} as const;

export const palette = {
  text: '#0f0f0f',
  textMuted: '#5c5c5c',
  pageBg: '#f6f6f6',
  surface: '#ffffff',
  border: '#d8d8d8',
  link: '#646cff',
  linkHover: '#535bf2',
  controlBg: '#ffffff',
  controlText: '#0f0f0f',
  controlBorderActive: '#396cd8',
  controlBgActive: '#e8e8e8',
  accent: '#396cd8',
  accentMuted: '#e8eef8',
  danger: '#b42318',
  textDark: '#f6f6f6',
  textMutedDark: '#a8a8a8',
  pageBgDark: '#2f2f2f',
  surfaceDark: '#1a1a1a',
  borderDark: '#404040',
  linkHoverDark: '#24c8db',
  controlBgDark: '#0f0f0f98',
  controlTextDark: '#ffffff',
  controlBgActiveDark: '#0f0f0f69',
  accentMutedDark: '#1e2a3d',
  codeBlockBg: '#ececec',
  codeBlockBgDark: '#242424',
  codeBlockText: '#1a1a1a',
  codeBlockTextDark: '#e8e8e8'
} as const;

/** Pastel letter colors for collapsed workspace initials (readable on light and dark surfaces). */
export const workspaceSwatches = [
  {letter: '#7a9fd4', letterDark: '#adc8ef'},
  {letter: '#6db5a8', letterDark: '#9dd9cf'},
  {letter: '#a494d4', letterDark: '#c9bfe8'},
  {letter: '#c9ad6e', letterDark: '#e8d4a0'},
  {letter: '#d48a9e', letterDark: '#eab8c4'},
  {letter: '#7cbd88', letterDark: '#abd9b4'},
  {letter: '#6eb0ca', letterDark: '#9fd0e3'},
  {letter: '#c492c0', letterDark: '#dfb8db'}
] as const;
