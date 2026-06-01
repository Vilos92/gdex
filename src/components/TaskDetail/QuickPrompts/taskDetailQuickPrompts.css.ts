import {globalStyle, style} from '@vanilla-extract/css';
import {darkHtmlSelector, darkSelector, inDarkScheme} from '@/styles/darkScheme';
import {panelIconButton} from '@/styles/iconButton.css';
import {fonts, palette} from '@/styles/tokens';

/*
 * Styles.
 */

/** Collapsible quick-prompt block (closed by default; native `<details>` disclosure). */
export const quickPromptsDetails = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.4rem',
  minWidth: 0
});

/** Matches `sectionLabel`; disclosure chevron via `::before` (›). */
export const quickPromptsSummary = style({
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

globalStyle(`${quickPromptsDetails}[open] ${quickPromptsSummary}::before`, {
  transform: 'rotate(90deg) translateY(-0.03em)'
});

globalStyle(`${quickPromptsDetails}[open] ${quickPromptsSummary}`, {
  color: palette.textMuted
});

globalStyle(`${darkHtmlSelector} ${quickPromptsDetails}[open] ${quickPromptsSummary}`, {
  color: palette.textMutedDark
});

export const quickPromptStack = style({
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '8px',
  backgroundColor: palette.codeBlockBg,
  overflow: 'hidden',
  ...inDarkScheme({
    backgroundColor: palette.codeBlockBgDark
  })
});

export const quickPromptSelect = style({
  width: '100%',
  minWidth: 0,
  padding: '0.6rem 1.75rem 0.6rem 0.8rem',
  border: 'none',
  borderBottom: `1px solid ${palette.border}`,
  borderRadius: 0,
  backgroundColor: 'transparent',
  color: palette.text,
  fontSize: '0.875rem',
  fontWeight: 500,
  lineHeight: 1.4,
  boxShadow: 'none',
  transition: 'background-color 120ms',
  selectors: {
    '&:hover': {
      backgroundColor: palette.accentMuted
    },
    '&:focus-visible': {
      outline: `2px solid ${palette.controlBorderActive}`,
      outlineOffset: '-2px',
      backgroundColor: palette.accentMuted
    },
    [darkSelector(':hover')]: {
      backgroundColor: palette.accentMutedDark
    },
    [darkSelector(':focus-visible')]: {
      outline: `2px solid ${palette.controlBorderActive}`,
      outlineOffset: '-2px',
      backgroundColor: palette.accentMutedDark
    },
    [darkSelector()]: {
      borderBottomColor: palette.borderDark,
      color: palette.textDark
    }
  }
});

export const quickPromptCode = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'stretch',
  backgroundColor: 'transparent',
  overflow: 'hidden'
});

export const quickPromptCodeToolbar = style({
  display: 'flex',
  flexDirection: 'column',
  flexShrink: 0,
  alignItems: 'center',
  padding: '0.2rem 0.25rem 0.2rem 0'
});

export const quickPromptCopyButton = style([
  panelIconButton,
  {
    selectors: {
      '&:hover': {
        backgroundColor: palette.surface,
        borderColor: 'transparent',
        boxShadow: 'none',
        color: palette.text
      },
      '&:active': {
        backgroundColor: palette.controlBgActive,
        borderColor: 'transparent',
        boxShadow: 'none'
      },
      [darkSelector(':hover')]: {
        backgroundColor: palette.pageBgDark,
        borderColor: 'transparent',
        boxShadow: 'none',
        color: palette.textDark
      },
      [darkSelector(':active')]: {
        backgroundColor: palette.controlBgActiveDark,
        borderColor: 'transparent',
        boxShadow: 'none'
      }
    }
  }
]);

export const quickPromptCopyButtonCopied = style({
  color: palette.accent
});

export const quickPromptCodeText = style({
  flex: '1 1 auto',
  minWidth: 0,
  margin: 0,
  padding: '0.5rem 0.4rem 0.5rem 0.55rem',
  fontFamily: fonts.mono,
  fontSize: '0.8125rem',
  lineHeight: 1.55,
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  color: palette.codeBlockText,
  ...inDarkScheme({
    color: palette.codeBlockTextDark
  })
});
