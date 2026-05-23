import {style} from '@vanilla-extract/css';

import {palette} from '@/styles/tokens';

export {section, sectionLabel} from '@/components/panelSection.css';

/*
 * Styles.
 */

export const panel = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  flex: '1 1 0',
  alignSelf: 'stretch',
  minWidth: 0,
  minHeight: 0,
  overflowY: 'auto',
  overflowWrap: 'anywhere'
});

export const name = style({
  margin: 0,
  fontSize: '1.375rem',
  fontWeight: 600,
  letterSpacing: '-0.02em',
  lineHeight: 1.3
});

export const sectionBody = style({
  margin: 0,
  fontSize: '0.875rem',
  lineHeight: 1.5,
  fontFamily: 'monospace',
  wordBreak: 'break-all',
  color: palette.text,
  '@media': {
    '(prefers-color-scheme: dark)': {
      color: palette.textDark
    }
  }
});

export const actionsSection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  marginTop: 'auto',
  paddingTop: '1rem',
  borderTop: `1px solid ${palette.border}`,
  '@media': {
    '(prefers-color-scheme: dark)': {
      borderColor: palette.borderDark
    }
  }
});

export const deleteButton = style({
  alignSelf: 'flex-start',
  padding: '0.4em 0.9em',
  fontSize: '0.875rem',
  color: palette.danger,
  borderColor: palette.danger,
  backgroundColor: 'transparent',
  selectors: {
    '&:hover': {
      backgroundColor: palette.danger,
      color: palette.surface,
      borderColor: palette.danger
    }
  },
  '@media': {
    '(prefers-color-scheme: dark)': {
      selectors: {
        '&:hover': {
          color: palette.surfaceDark
        }
      }
    }
  }
});

export const confirmRow = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem'
});

export const confirmText = style({
  margin: 0,
  fontSize: '0.875rem',
  color: palette.textMuted,
  '@media': {
    '(prefers-color-scheme: dark)': {
      color: palette.textMutedDark
    }
  }
});

export const confirmActions = style({
  display: 'flex',
  gap: '0.5rem',
  alignItems: 'center'
});

export const confirmDeleteButton = style({
  padding: '0.4em 0.9em',
  fontSize: '0.875rem',
  color: palette.surface,
  backgroundColor: palette.danger,
  borderColor: palette.danger,
  selectors: {
    '&:hover': {
      opacity: 0.85
    },
    '&:disabled': {
      cursor: 'not-allowed',
      opacity: 0.45
    }
  }
});

export const cancelButton = style({
  padding: '0.4em 0.9em',
  fontSize: '0.875rem',
  backgroundColor: 'transparent',
  boxShadow: 'none',
  borderColor: 'transparent',
  selectors: {
    '&:hover': {
      backgroundColor: palette.accentMuted,
      borderColor: 'transparent'
    }
  },
  '@media': {
    '(prefers-color-scheme: dark)': {
      selectors: {
        '&:hover': {
          backgroundColor: palette.accentMutedDark
        }
      }
    }
  }
});

export const deleteError = style({
  margin: 0,
  fontSize: '0.875rem',
  color: palette.danger
});
