import {style} from '@vanilla-extract/css';

import {darkSelector, inDarkScheme} from '@/styles/darkScheme';
import {palette} from '@/styles/tokens';

/*
 * Styles.
 */

export const board = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  flex: '0 1 13rem',
  alignSelf: 'stretch',
  minWidth: '7rem',
  maxWidth: '16rem',
  minHeight: 0,
  overflow: 'hidden'
});

export const list = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.35rem',
  flex: 1,
  minHeight: 0,
  margin: 0,
  padding: 0,
  listStyle: 'none',
  overflowX: 'hidden',
  overflowY: 'auto'
});

export const taskButton = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.65rem',
  width: '100%',
  textAlign: 'left',
  padding: '0.6em 0.75em',
  borderRadius: '8px',
  border: `1px solid transparent`,
  backgroundColor: palette.surface,
  boxShadow: 'none',
  fontWeight: 500,
  ...inDarkScheme({
    backgroundColor: palette.surfaceDark
  }),
  selectors: {
    '&:hover': {
      backgroundColor: palette.accentMuted,
      borderColor: 'transparent',
      boxShadow: 'none'
    },
    [darkSelector(':hover')]: {
      backgroundColor: palette.accentMutedDark,
      borderColor: 'transparent',
      boxShadow: 'none'
    }
  }
});

export const taskButtonSelected = style({
  backgroundColor: palette.accentMuted,
  borderColor: palette.accent,
  ...inDarkScheme({
    backgroundColor: palette.accentMutedDark,
    borderColor: palette.accent
  }),
  selectors: {
    '&:hover': {
      backgroundColor: palette.accentMuted,
      borderColor: palette.accent,
      boxShadow: 'none'
    },
    [darkSelector(':hover')]: {
      backgroundColor: palette.accentMutedDark,
      borderColor: palette.accent,
      boxShadow: 'none'
    },
    [darkSelector()]: {
      backgroundColor: palette.accentMutedDark,
      borderColor: palette.accent
    }
  }
});

export const statusDot = style({
  flexShrink: 0,
  width: '0.5rem',
  height: '0.5rem',
  borderRadius: '50%'
});

export const statusPending = style({
  backgroundColor: palette.border,
  ...inDarkScheme({
    backgroundColor: palette.borderDark
  })
});

export const statusInProgress = style({
  backgroundColor: palette.accent
});

export const statusDone = style({
  backgroundColor: palette.textMuted,
  ...inDarkScheme({
    backgroundColor: palette.textMutedDark
  })
});

export const taskName = style({
  flex: 1,
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
});

export const taskNameDone = style({
  color: palette.textMuted,
  textDecoration: 'line-through',
  ...inDarkScheme({
    color: palette.textMutedDark
  })
});

export const emptyMessage = style({
  margin: 0,
  fontSize: '0.9375rem',
  color: palette.textMuted,
  ...inDarkScheme({
    color: palette.textMutedDark
  })
});

export const taskLoadError = style({
  margin: 0,
  fontSize: '0.9375rem',
  color: palette.danger
});
