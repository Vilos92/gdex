import {globalStyle, style} from '@vanilla-extract/css';

import {inDarkScheme} from '@/styles/darkScheme';
import {palette} from '@/styles/tokens';

/*
 * Styles.
 */

globalStyle('@property --task-board-width', {
  syntax: '<length>',
  inherits: false,
  initialValue: '13rem'
} as unknown as Parameters<typeof globalStyle>[1]);

export const splash = style({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1.5rem',
  padding: '2rem'
});

export const splashTitle = style({
  margin: 0,
  fontSize: '2.5rem',
  fontWeight: 600,
  letterSpacing: '-0.03em'
});

export const splashSubtitle = style({
  margin: 0,
  maxWidth: '28rem',
  textAlign: 'center',
  color: palette.textMuted,
  ...inDarkScheme({
    color: palette.textMutedDark
  })
});

export const appFrame = style({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  overflow: 'hidden'
});

export const shell = style({
  display: 'flex',
  flex: 1,
  minHeight: 0,
  minWidth: 0
});

export const main = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
  minHeight: 0,
  overflow: 'hidden',
  padding: '1rem 1.25rem'
});

export const workspaceMain = style({
  display: 'grid',
  flex: 1,
  width: '100%',
  alignItems: 'stretch',
  minHeight: 0,
  minWidth: 0,
  overflow: 'hidden',
  gridTemplateColumns: 'var(--task-board-width, 13rem) auto 1fr',
  columnGap: '1rem'
});

export const workspaceMainDetail = style({
  minWidth: 0,
  minHeight: 0,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  containerType: 'inline-size',
  containerName: 'task-detail',
  selectors: {
    '&:focus': {outline: 'none'},
    '&:focus-visible': {outline: 'none'}
  }
});

export const workspaceMainMessage = style({
  gridColumn: '1 / -1'
});

export const placeholder = style({
  margin: 0,
  fontSize: '1.125rem',
  color: palette.textMuted,
  ...inDarkScheme({
    color: palette.textMutedDark
  })
});

export const loading = style({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: palette.textMuted,
  ...inDarkScheme({
    color: palette.textMutedDark
  })
});

export const loadError = style({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.75rem',
  padding: '2rem',
  color: palette.danger
});
