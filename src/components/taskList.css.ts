import {style} from '@vanilla-extract/css';

import {palette} from '@/styles/tokens';

/*
 * Styles.
 */

export const board = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  width: '100%',
  maxWidth: '42rem'
});

export const list = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.35rem',
  margin: 0,
  padding: 0,
  listStyle: 'none'
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
  backgroundColor: 'transparent',
  boxShadow: 'none',
  fontWeight: 500
});

export const taskButtonSelected = style({
  backgroundColor: palette.accentMuted,
  borderColor: palette.accent,
  '@media': {
    '(prefers-color-scheme: dark)': {
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
  '@media': {
    '(prefers-color-scheme: dark)': {
      backgroundColor: palette.borderDark
    }
  }
});

export const statusInProgress = style({
  backgroundColor: palette.accent
});

export const statusDone = style({
  backgroundColor: palette.textMuted,
  '@media': {
    '(prefers-color-scheme: dark)': {
      backgroundColor: palette.textMutedDark
    }
  }
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
  '@media': {
    '(prefers-color-scheme: dark)': {
      color: palette.textMutedDark
    }
  }
});

export const emptyMessage = style({
  margin: 0,
  fontSize: '0.9375rem',
  color: palette.textMuted,
  '@media': {
    '(prefers-color-scheme: dark)': {
      color: palette.textMutedDark
    }
  }
});

export const taskLoadError = style({
  margin: 0,
  fontSize: '0.9375rem',
  color: palette.danger
});
