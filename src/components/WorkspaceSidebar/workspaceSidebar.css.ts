import {style} from '@vanilla-extract/css';
import {inDarkScheme} from '@/styles/darkScheme';
import {panelIconButton} from '@/styles/iconButton.css';
import {listRowButtonInset, listRowButtonSelected} from '@/styles/listRowButton.css';
import {palette} from '@/styles/tokens';

/*
 * Styles.
 */

const sidebarSurface = {
  alignSelf: 'stretch',
  minHeight: 0,
  overflow: 'hidden',
  borderRight: `1px solid ${palette.border}`,
  backgroundColor: palette.surface
} as const;

const sidebarSurfaceDark = inDarkScheme({
  borderColor: palette.borderDark,
  backgroundColor: palette.surfaceDark
});

export const sidebar = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  flex: '0 1 11rem',
  minWidth: '8.5rem',
  maxWidth: '13rem',
  padding: '1rem',
  ...sidebarSurface,
  ...sidebarSurfaceDark
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
  ...sidebarSurface,
  ...sidebarSurfaceDark
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

export const collapsedWorkspaceStrip = style([
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

export const collapsedWorkspaceList = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.35rem',
  margin: 0,
  padding: 0,
  listStyle: 'none',
  width: '100%'
});

export const collapsedWorkspaceSquare = style([
  listRowButtonInset,
  {
    display: 'grid',
    placeItems: 'center',
    boxSizing: 'border-box',
    width: '2rem',
    height: '2rem',
    margin: 0,
    padding: 0,
    fontSize: '0.875rem',
    fontWeight: 600,
    lineHeight: 1,
    textAlign: 'center',
    textBoxTrim: 'trim-both',
    textBoxEdge: 'cap alphabetic'
  }
]);

export const collapsedWorkspaceSquareActive = listRowButtonSelected;

export const collapseToggle = panelIconButton;

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

export const workspaceList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.35rem',
  margin: 0,
  padding: 0,
  listStyle: 'none'
});

export const workspaceButton = style([
  listRowButtonInset,
  {
    width: '100%',
    textAlign: 'left',
    padding: '0.55em 0.75em'
  }
]);

export const workspaceButtonActive = listRowButtonSelected;

export const addSection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  paddingTop: '0.75rem',
  borderTop: `1px solid ${palette.border}`,
  ...inDarkScheme({
    borderColor: palette.borderDark
  })
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
