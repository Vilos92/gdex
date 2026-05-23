import {style} from '@vanilla-extract/css';

import {palette} from '@/styles/tokens';

/*
 * Styles.
 */

/** Ghost icon control (sidebar collapse, code-block copy, etc.). */
export const panelIconButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: '1.75rem',
  height: '1.75rem',
  margin: 0,
  padding: 0,
  border: 'none',
  borderRadius: '6px',
  backgroundColor: 'transparent',
  boxShadow: 'none',
  color: palette.textMuted,
  selectors: {
    '&:hover': {
      backgroundColor: palette.accentMuted,
      borderColor: 'transparent',
      boxShadow: 'none',
      color: palette.text
    },
    '&:active': {
      backgroundColor: palette.accentMuted,
      borderColor: 'transparent',
      boxShadow: 'none'
    },
    '&:focus-visible': {
      outline: `2px solid ${palette.accent}`,
      outlineOffset: '2px'
    }
  },
  '@media': {
    '(prefers-color-scheme: dark)': {
      color: palette.textMutedDark,
      selectors: {
        '&:hover': {
          backgroundColor: palette.accentMutedDark,
          color: palette.textDark
        },
        '&:active': {
          backgroundColor: palette.accentMutedDark
        }
      }
    }
  }
});
