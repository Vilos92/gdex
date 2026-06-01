import {style} from '@vanilla-extract/css';
import {darkSelector, inDarkScheme} from '@/styles/darkScheme';
import {panelIconButton} from '@/styles/iconButton.css';
import {palette} from '@/styles/tokens';

/*
 * Styles.
 */

export const topBar = style({
  display: 'flex',
  alignItems: 'center',
  flexShrink: 0,
  height: '2.75rem',
  padding: '0 1.25rem',
  borderBottom: `1px solid ${palette.border}`,
  backgroundColor: palette.surface,
  ...inDarkScheme({
    borderColor: palette.borderDark,
    backgroundColor: palette.surfaceDark
  })
});

export const topBarMain = style({
  display: 'flex',
  alignItems: 'center',
  flex: 1,
  minWidth: 0,
  gap: '0.5rem'
});

export const breadcrumb = style({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'nowrap',
  gap: '0.35rem',
  margin: 0,
  minWidth: 0,
  height: '1.25rem',
  lineHeight: 1,
  fontSize: '0.875rem'
});

const breadcrumbItem = style({
  display: 'inline-flex',
  alignItems: 'center',
  margin: 0,
  padding: 0,
  fontSize: '0.875rem',
  fontWeight: 500,
  lineHeight: 1,
  whiteSpace: 'nowrap'
});

export const breadcrumbSegment = style([
  breadcrumbItem,
  {
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    fontFamily: 'inherit',
    border: 'none',
    borderRadius: 0,
    backgroundColor: 'transparent',
    boxShadow: 'none',
    transition: 'none',
    color: palette.link,
    textDecoration: 'inherit',
    selectors: {
      '&:hover': {
        borderColor: 'transparent',
        backgroundColor: 'transparent',
        boxShadow: 'none',
        color: palette.linkHover,
        textDecoration: 'underline'
      },
      '&:active': {
        borderColor: 'transparent',
        backgroundColor: 'transparent',
        boxShadow: 'none'
      },
      '&:focus-visible': {
        outline: `2px solid ${palette.accent}`,
        outlineOffset: '2px',
        borderRadius: '4px'
      },
      [darkSelector(':hover')]: {
        color: palette.linkHoverDark
      }
    }
  }
]);

export const breadcrumbSeparator = style([
  breadcrumbItem,
  {
    color: palette.textMuted,
    ...inDarkScheme({
      color: palette.textMutedDark
    })
  }
]);

export const breadcrumbCurrent = style([
  breadcrumbItem,
  {
    color: palette.textMuted,
    ...inDarkScheme({
      color: palette.textMutedDark
    })
  }
]);

export const appTitle = style([
  breadcrumbItem,
  {
    fontWeight: 600,
    letterSpacing: '-0.02em'
  }
]);

export const themeToggle = style([panelIconButton]);
