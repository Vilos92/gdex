import {style} from '@vanilla-extract/css';

import {palette} from '@/styles/tokens';

/*
 * Styles.
 */

const sidebarSurface = {
  alignSelf: 'stretch',
  minHeight: 0,
  overflow: 'hidden',
  borderRight: `1px solid ${palette.border}`,
  backgroundColor: palette.surface,
  '@media': {
    '(prefers-color-scheme: dark)': {
      borderColor: palette.borderDark,
      backgroundColor: palette.surfaceDark
    }
  }
} as const;

export const sidebar = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  flex: '0 1 11rem',
  minWidth: '8.5rem',
  maxWidth: '13rem',
  padding: '1rem',
  ...sidebarSurface
});

export const sidebarBody = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  flex: 1,
  minHeight: 0,
  overflowX: 'hidden',
  overflowY: 'auto'
});

export const sidebarCollapsed = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.5rem',
  flex: '0 0 2.75rem',
  width: '2.75rem',
  minWidth: '2.75rem',
  maxWidth: '2.75rem',
  padding: '1rem 0.35rem',
  ...sidebarSurface
});

export const sidebarCollapsedBody = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  flex: 1,
  minHeight: 0,
  width: '100%',
  gap: '0.5rem'
});

const scrollbarHidden = style({
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  selectors: {
    '&::-webkit-scrollbar': {
      display: 'none'
    }
  }
});

export const collapsedProjectStrip = style([
  scrollbarHidden,
  {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    minHeight: 0,
    width: '100%',
    overflowY: 'auto',
    overflowX: 'hidden',
    padding: '0 0.1rem'
  }
]);

export const collapsedProjectList = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.35rem',
  margin: 0,
  padding: 0,
  listStyle: 'none',
  width: '100%'
});

export const collapsedProjectSquare = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '2rem',
  height: '2rem',
  margin: 0,
  padding: 0,
  border: `1px solid transparent`,
  borderRadius: '8px',
  backgroundColor: 'transparent',
  boxShadow: 'none',
  fontSize: '0.875rem',
  fontWeight: 600,
  lineHeight: 1,
  color: palette.text,
  selectors: {
    '&:hover': {
      backgroundColor: palette.accentMuted,
      borderColor: 'transparent'
    },
    '&:focus-visible': {
      outline: `2px solid ${palette.accent}`,
      outlineOffset: '2px'
    }
  },
  '@media': {
    '(prefers-color-scheme: dark)': {
      color: palette.textDark,
      selectors: {
        '&:hover': {
          backgroundColor: palette.accentMutedDark
        }
      }
    }
  }
});

export const collapsedProjectSquareActive = style({
  backgroundColor: palette.accentMuted,
  borderColor: palette.accent,
  '@media': {
    '(prefers-color-scheme: dark)': {
      backgroundColor: palette.accentMutedDark,
      borderColor: palette.accent
    }
  }
});

export const collapseToggle = style({
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

export const collapsedAddButton = style([
  collapseToggle,
  {
    fontSize: '1.25rem',
    fontWeight: 500,
    lineHeight: 1
  }
]);

export const sidebarHeader = style({
  display: 'flex',
  alignItems: 'center',
  flexShrink: 0,
  width: '100%',
  height: '1.75rem',
  gap: '0.5rem',
  minWidth: 0
});

export const sidebarHeaderCollapsed = style({
  justifyContent: 'center',
  gap: 0
});

export const title = style({
  margin: 0,
  flex: 1,
  minWidth: 0,
  fontSize: '1.25rem',
  fontWeight: 600,
  lineHeight: 1,
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
