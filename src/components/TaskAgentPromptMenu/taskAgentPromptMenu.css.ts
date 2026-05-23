import {globalStyle, style} from '@vanilla-extract/css';

import {sectionLabel} from '@/components/panelSection.css';
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
  '@media': {
    '(prefers-color-scheme: dark)': {
      borderColor: palette.borderDark,
      backgroundColor: palette.surfaceDark,
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)'
    }
  }
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
  cursor: 'pointer',
  transition: 'background-color 120ms',
  selectors: {
    '&:hover:enabled': {
      backgroundColor: palette.pageBg,
      borderColor: 'transparent',
      boxShadow: 'none'
    },
    '&:disabled': {
      color: palette.textMuted,
      cursor: 'default'
    }
  },
  '@media': {
    '(prefers-color-scheme: dark)': {
      color: palette.textDark,
      selectors: {
        '&:hover:enabled': {
          backgroundColor: palette.pageBgDark
        },
        '&:disabled': {
          color: palette.textMutedDark
        }
      }
    }
  }
});

export const menuItemLabel = style({
  flex: '1 1 auto',
  minWidth: 0,
  textAlign: 'left'
});

/** Mirrors `panelIconButton` (code-block copy) when the menu row is hovered. */
export const menuItemIconWrap = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: '1.75rem',
  height: '1.75rem',
  borderRadius: '6px',
  color: palette.textMuted,
  selectors: {
    'button:hover:enabled &': {
      backgroundColor: palette.surface,
      boxShadow: `inset 0 0 0 1px ${palette.border}`,
      color: palette.text
    },
    'button:disabled &': {
      opacity: 0.45
    }
  },
  '@media': {
    '(prefers-color-scheme: dark)': {
      color: palette.textMutedDark,
      selectors: {
        'button:hover:enabled &': {
          backgroundColor: palette.codeBlockBgDark,
          boxShadow: `inset 0 0 0 1px ${palette.borderDark}`,
          color: palette.textDark
        }
      }
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
