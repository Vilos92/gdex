import {style} from '@vanilla-extract/css';

import {inDarkScheme} from '@/styles/darkScheme';
import {palette} from '@/styles/tokens';

/*
 * Styles.
 */

export const field = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  textAlign: 'left'
});

export const label = style({
  fontSize: '0.875rem',
  fontWeight: 500
});

export const pathRow = style({
  display: 'flex',
  gap: '0.65rem',
  alignItems: 'stretch'
});

export const pathRowStacked = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: '0.5rem'
});

export const pathChooseButton = style({
  alignSelf: 'flex-start',
  padding: '0.45em 0.85em',
  fontSize: '0.875rem',
  whiteSpace: 'nowrap'
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
  ...inDarkScheme({
    borderColor: palette.borderDark,
    backgroundColor: palette.surfaceDark,
    color: palette.textMutedDark
  })
});

export const pathValueSet = style({
  color: palette.text,
  ...inDarkScheme({
    color: palette.textDark
  })
});
