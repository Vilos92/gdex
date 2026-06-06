import {style} from '@vanilla-extract/css';
import {darkSelector, inDarkScheme} from '@/styles/darkScheme';
import {panelIconButton} from '@/styles/iconButton.css';
import {fonts, palette} from '@/styles/tokens';

/*
 * Constants.
 */

/** Cap prompt text at ~5 lines. `max-height` tracks `lineHeight` below. */
const QUICK_PROMPT_CODE_MAX_LINES = 5;
const QUICK_PROMPT_CODE_LINE_HEIGHT = 1.55;

/*
 * Styles.
 */

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
  lineHeight: QUICK_PROMPT_CODE_LINE_HEIGHT,
  maxHeight: `calc(1em * ${QUICK_PROMPT_CODE_LINE_HEIGHT} * ${QUICK_PROMPT_CODE_MAX_LINES})`,
  overflowY: 'auto',
  scrollbarWidth: 'thin',
  scrollbarColor: `${palette.border} transparent`,
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  color: palette.codeBlockText,
  selectors: {
    '&::-webkit-scrollbar': {
      width: '6px'
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: palette.border,
      borderRadius: '3px'
    },
    [darkSelector('&::-webkit-scrollbar-thumb')]: {
      backgroundColor: palette.borderDark
    },
    [darkSelector()]: {
      color: palette.codeBlockTextDark,
      scrollbarColor: `${palette.borderDark} transparent`
    }
  }
});
