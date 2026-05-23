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
