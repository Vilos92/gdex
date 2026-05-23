import {style} from '@vanilla-extract/css';

import {palette} from '@/styles/tokens';

/*
 * Styles.
 */

export const field = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.35rem',
  textAlign: 'left'
});

export const label = style({
  fontSize: '0.875rem',
  fontWeight: 500
});

export const pathRow = style({
  display: 'flex',
  gap: '0.5rem',
  alignItems: 'stretch'
});

export const pathValue = style({
  flex: 1,
  minWidth: 0,
  padding: '0.55em 0.75em',
  borderRadius: '8px',
  border: `1px solid ${palette.border}`,
  backgroundColor: palette.surface,
  fontSize: '0.875rem',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  color: palette.textMuted,
  '@media': {
    '(prefers-color-scheme: dark)': {
      borderColor: palette.borderDark,
      backgroundColor: palette.surfaceDark,
      color: palette.textMutedDark
    }
  }
});

export const pathValueSet = style({
  color: palette.text,
  '@media': {
    '(prefers-color-scheme: dark)': {
      color: palette.textDark
    }
  }
});
