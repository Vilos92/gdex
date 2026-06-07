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
/** Matches `::-webkit-scrollbar` width and overlay copy inset below. */
const QUICK_PROMPT_SCROLLBAR_WIDTH = '6px';
const QUICK_PROMPT_COPY_BUTTON_SIZE = '1.75rem';
/** Copy button `right` inset — clears the scrollbar track. */
const QUICK_PROMPT_CODE_EDGE_INSET = '0.25rem';
/** `<pre>` `padding-right` — flush with the overlay copy button. */
const QUICK_PROMPT_CODE_TEXT_PADDING_RIGHT = QUICK_PROMPT_COPY_BUTTON_SIZE;
const QUICK_PROMPT_COPY_BUTTON_INSET_RIGHT = `calc(${QUICK_PROMPT_SCROLLBAR_WIDTH} + ${QUICK_PROMPT_CODE_EDGE_INSET})`;

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
  position: 'relative',
  backgroundColor: 'transparent',
  overflow: 'hidden'
});

export const quickPromptCopyButton = style([
  panelIconButton,
  {
    position: 'absolute',
    top: '0.2rem',
    right: QUICK_PROMPT_COPY_BUTTON_INSET_RIGHT,
    zIndex: 1,
    backgroundColor: palette.codeBlockBg,
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
      [darkSelector()]: {
        backgroundColor: palette.codeBlockBgDark
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
  margin: 0,
  padding: `0.5rem ${QUICK_PROMPT_CODE_TEXT_PADDING_RIGHT} 0.5rem 0.55rem`,
  fontFamily: fonts.mono,
  fontSize: '0.8125rem',
  lineHeight: QUICK_PROMPT_CODE_LINE_HEIGHT,
  maxHeight: `calc(1em * ${QUICK_PROMPT_CODE_LINE_HEIGHT} * ${QUICK_PROMPT_CODE_MAX_LINES})`,
  overflowY: 'auto',
  scrollbarGutter: 'stable',
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
