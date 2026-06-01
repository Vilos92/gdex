import {style} from '@vanilla-extract/css';

import {palette} from '@/styles/tokens';

/*
 * Styles.
 */

export const form = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
  width: '100%',
  maxWidth: '28rem'
});

/** Roomier layout when the form lives in the narrow workspace sidebar. */
export const formSidebar = style({
  gap: '1.35rem',
  maxWidth: 'none'
});

export const nameInput = style({
  padding: '0.5em 0.75em',
  fontSize: '0.875rem'
});

export const error = style({
  margin: 0,
  fontSize: '0.875rem',
  color: palette.danger,
  textAlign: 'left'
});

export const submitButton = style({
  alignSelf: 'stretch',
  padding: '0.55em 1em',
  fontSize: '0.875rem',
  whiteSpace: 'nowrap',
  selectors: {
    '&:disabled': {
      opacity: 0.45,
      borderColor: 'transparent',
      boxShadow: 'none'
    },
    '&:disabled:hover': {
      borderColor: 'transparent'
    }
  }
});
