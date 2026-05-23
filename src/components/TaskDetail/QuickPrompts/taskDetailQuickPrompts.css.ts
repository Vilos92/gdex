import {style} from '@vanilla-extract/css';

import {panelIconButton} from '@/styles/iconButton.css';
import {fonts, palette} from '@/styles/tokens';

export {section, sectionLabel} from '@/components/panelSection.css';

/*
 * Styles.
 */

export const quickPromptStack = style({
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '8px',
  backgroundColor: palette.codeBlockBg,
  overflow: 'hidden',
  '@media': {
    '(prefers-color-scheme: dark)': {
      backgroundColor: palette.codeBlockBgDark
    }
  }
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
  cursor: 'pointer',
  boxShadow: 'none',
  transition: 'background-color 120ms',
  ':hover': {
    backgroundColor: palette.accentMuted
  },
  ':focus-visible': {
    outline: `2px solid ${palette.controlBorderActive}`,
    outlineOffset: '-2px',
    backgroundColor: palette.accentMuted
  },
  '@media': {
    '(prefers-color-scheme: dark)': {
      borderBottomColor: palette.borderDark,
      color: palette.textDark,
      selectors: {
        '&:hover': {
          backgroundColor: palette.accentMutedDark
        },
        '&:focus-visible': {
          backgroundColor: palette.accentMutedDark
        }
      }
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
      }
    },
    '@media': {
      '(prefers-color-scheme: dark)': {
        selectors: {
          '&:hover': {
            backgroundColor: palette.pageBgDark,
            color: palette.textDark
          },
          '&:active': {
            backgroundColor: palette.controlBgActiveDark
          }
        }
      }
    }
  }
]);

export const quickPromptCopyButtonCopied = style({
  color: palette.accent,
  '@media': {
    '(prefers-color-scheme: dark)': {
      color: palette.accent
    }
  }
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
  '@media': {
    '(prefers-color-scheme: dark)': {
      color: palette.codeBlockTextDark
    }
  }
});
