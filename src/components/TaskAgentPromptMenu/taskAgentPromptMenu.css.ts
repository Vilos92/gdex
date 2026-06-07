import {globalStyle, style} from '@vanilla-extract/css';
import {darkSelector, inDarkScheme} from '@/styles/darkScheme';
import {sectionLabel} from '@/styles/panelSection.css';
import {palette} from '@/styles/tokens';

/*
 * Styles.
 */

export const menuHeader = style([
  sectionLabel,
  {
    padding: '0.2rem 0.65rem 0.15rem'
  }
]);

export const menu = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.1rem',
  position: 'fixed',
  zIndex: 100,
  width: 'max-content',
  minWidth: '9.75rem',
  maxWidth: '10.75rem',
  margin: 0,
  padding: '0.3rem',
  borderRadius: '8px',
  border: `1px solid ${palette.border}`,
  backgroundColor: palette.surface,
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.18)',
  ...inDarkScheme({
    borderColor: palette.borderDark,
    backgroundColor: palette.surfaceDark,
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)'
  })
});

export const menuItem = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '0.75rem',
  width: '100%',
  margin: 0,
  padding: '0.4rem 0.5rem',
  border: 'none',
  borderRadius: '6px',
  backgroundColor: 'transparent',
  boxShadow: 'none',
  color: palette.text,
  fontSize: '0.875rem',
  fontWeight: 500,
  lineHeight: 1.35,
  textAlign: 'left',
  transition: 'background-color 120ms',
  selectors: {
    '&:hover:enabled': {
      backgroundColor: palette.pageBg,
      borderColor: 'transparent',
      boxShadow: 'none'
    },
    '&:disabled': {
      color: palette.textMuted
    },
    [darkSelector(':hover:enabled')]: {
      backgroundColor: palette.pageBgDark,
      borderColor: 'transparent',
      boxShadow: 'none'
    },
    [darkSelector(':disabled')]: {
      color: palette.textMutedDark
    },
    [darkSelector()]: {
      color: palette.textDark
    }
  }
});

export const menuItemLabel = style({
  flex: '1 1 auto',
  minWidth: 0,
  textAlign: 'left'
});

/** Clipboard hint on the trailing edge. Row hover handles background feedback. */
export const menuItemIconWrap = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: '1.75rem',
  height: '1.75rem',
  color: palette.textMuted,
  selectors: {
    'button:hover:enabled &': {
      color: palette.text
    },
    'button:disabled &': {
      opacity: 0.45
    },
    [darkSelector('button:hover:enabled &')]: {
      color: palette.textDark
    },
    [darkSelector()]: {
      color: palette.textMutedDark
    }
  }
});

globalStyle(`${menu} button`, {
  appearance: 'none',
  WebkitAppearance: 'none',
  MozAppearance: 'none',
  boxSizing: 'border-box',
  border: 'none',
  borderRadius: '6px',
  backgroundColor: 'transparent',
  boxShadow: 'none',
  fontFamily: 'inherit',
  fontSize: '0.875rem',
  fontWeight: 500,
  lineHeight: 1.35
});

globalStyle(`${menu} button:hover:enabled`, {
  borderColor: 'transparent'
});

globalStyle(`${menu} button:active:enabled`, {
  borderColor: 'transparent',
  boxShadow: 'none'
});
