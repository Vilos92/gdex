import {style} from '@vanilla-extract/css';

import {darkSelector, inDarkScheme} from '@/styles/darkScheme';
import {palette} from '@/styles/tokens';

export {section, sectionLabel} from '@/styles/panelSection.css';

/*
 * Styles.
 */

export const panel = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  flex: 1,
  minWidth: 0,
  minHeight: 0,
  overflowY: 'auto',
  overflowWrap: 'anywhere',
  '@container': {
    'task-detail (max-width: 24rem)': {
      gap: '1rem'
    }
  }
});

export const name = style({
  margin: 0,
  fontSize: '1.375rem',
  fontWeight: 600,
  letterSpacing: '-0.02em',
  lineHeight: 1.3,
  '@container': {
    'task-detail (max-width: 24rem)': {
      fontSize: '1.125rem'
    }
  }
});

export const sectionBody = style({
  margin: 0,
  fontSize: '0.875rem',
  lineHeight: 1.5,
  fontFamily: 'monospace',
  wordBreak: 'break-all',
  color: palette.text,
  ...inDarkScheme({
    color: palette.textDark
  })
});

export const actionsSection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  marginTop: 'auto',
  paddingTop: '1rem',
  borderTop: `1px solid ${palette.border}`,
  ...inDarkScheme({
    borderColor: palette.borderDark
  })
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
    },
    [darkSelector(':hover')]: {
      backgroundColor: palette.danger,
      color: palette.surfaceDark,
      borderColor: palette.danger
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
  ...inDarkScheme({
    color: palette.textMutedDark
  })
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
    },
    [darkSelector(':hover')]: {
      backgroundColor: palette.accentMutedDark,
      borderColor: 'transparent'
    }
  }
});

export const deleteError = style({
  margin: 0,
  fontSize: '0.875rem',
  color: palette.danger
});
