import {globalStyle, style} from '@vanilla-extract/css';
import {darkHtmlSelector, darkSelector, inDarkScheme} from '@/styles/darkScheme';
import {palette} from '@/styles/tokens';

/*
 * Styles.
 */

/** Long detail sections stay scannable — native `<details>` keeps heavy copy off-screen until opened. */
export const panelDisclosureDetails = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.4rem',
  minWidth: 0
});

/** Same muted caps look as static section headers, with a chevron instead of the browser marker. */
export const panelDisclosureSummary = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  margin: 0,
  padding: '0.15rem 0.1rem 0.15rem 0.2rem',
  borderRadius: '4px',
  fontSize: '0.75rem',
  fontWeight: 600,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: palette.textMuted,
  listStyle: 'none',
  cursor: 'default',
  userSelect: 'none',
  overflow: 'visible',
  ...inDarkScheme({
    color: palette.textMutedDark
  }),
  selectors: {
    '&::-webkit-details-marker': {
      display: 'none'
    },
    '&::marker': {
      content: '""'
    },
    '&::before': {
      content: '"›"',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      width: '0.65rem',
      fontSize: '0.875rem',
      fontWeight: 600,
      lineHeight: 1,
      color: 'inherit',
      transform: 'translateY(-0.03em)',
      transition: 'transform 120ms'
    },
    '&:hover': {
      color: palette.textMuted,
      backgroundColor: palette.accentMuted
    },
    '&:focus': {
      color: palette.textMuted
    },
    '&:focus-visible': {
      outline: `2px solid ${palette.accent}`,
      outlineOffset: '2px'
    },
    [darkSelector(':hover')]: {
      color: palette.textMutedDark,
      backgroundColor: palette.accentMutedDark
    },
    [darkSelector(':focus')]: {
      color: palette.textMutedDark
    }
  }
});

globalStyle(`${panelDisclosureDetails}[open] ${panelDisclosureSummary}::before`, {
  transform: 'rotate(90deg) translateY(-0.03em)'
});

globalStyle(`${panelDisclosureDetails}[open] ${panelDisclosureSummary}`, {
  color: palette.textMuted
});

globalStyle(`${darkHtmlSelector} ${panelDisclosureDetails}[open] ${panelDisclosureSummary}`, {
  color: palette.textMutedDark
});
