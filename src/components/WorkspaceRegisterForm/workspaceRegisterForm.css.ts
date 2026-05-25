import {style} from '@vanilla-extract/css';

import {palette} from '@/styles/tokens';

/*
 * Styles.
 */

export const form = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  width: '100%',
  maxWidth: '28rem'
});

export const error = style({
  margin: 0,
  fontSize: '0.875rem',
  color: palette.danger,
  textAlign: 'left'
});

export const submitButton = style({
  selectors: {
    '&:disabled': {
      cursor: 'not-allowed',
      opacity: 0.45,
      borderColor: 'transparent',
      boxShadow: 'none'
    },
    '&:disabled:hover': {
      borderColor: 'transparent'
    }
  }
});
