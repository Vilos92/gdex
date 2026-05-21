import {style} from '@vanilla-extract/css';

import {palette} from '@/styles/tokens';

/*
 * Styles.
 */

export const sidebar = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  minWidth: '14rem',
  maxWidth: '18rem',
  padding: '1.25rem',
  borderRight: `1px solid ${palette.border}`,
  backgroundColor: palette.surface,
  '@media': {
    '(prefers-color-scheme: dark)': {
      borderColor: palette.borderDark,
      backgroundColor: palette.surfaceDark
    }
  }
});

export const title = style({
  margin: 0,
  fontSize: '1.25rem',
  fontWeight: 600,
  letterSpacing: '-0.02em'
});

export const projectList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.35rem',
  margin: 0,
  padding: 0,
  listStyle: 'none'
});

export const projectButton = style({
  width: '100%',
  textAlign: 'left',
  padding: '0.55em 0.75em',
  borderRadius: '8px',
  border: `1px solid transparent`,
  backgroundColor: 'transparent',
  boxShadow: 'none',
  fontWeight: 500
});

export const projectButtonActive = style({
  backgroundColor: palette.accentMuted,
  borderColor: palette.accent,
  '@media': {
    '(prefers-color-scheme: dark)': {
      backgroundColor: palette.accentMutedDark,
      borderColor: palette.accent
    }
  }
});

export const addSection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  paddingTop: '0.5rem',
  borderTop: `1px solid ${palette.border}`,
  '@media': {
    '(prefers-color-scheme: dark)': {
      borderColor: palette.borderDark
    }
  }
});

export const addToggle = style({
  alignSelf: 'flex-start',
  padding: '0.4em 0.75em',
  fontSize: '0.875rem'
});

export const selectError = style({
  margin: 0,
  fontSize: '0.875rem',
  color: palette.danger
});
