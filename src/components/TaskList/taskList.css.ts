import {style} from '@vanilla-extract/css';
import {TASK_BOARD_ID} from '@/lib/keyboard/scope';
import {darkHtmlSelector, inDarkScheme} from '@/styles/darkScheme';
import {listRowButton, listRowButtonSelected} from '@/styles/listRowButton.css';
import {palette} from '@/styles/tokens';

/*
 * Styles.
 */

export const board = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  flex: 1,
  minHeight: 0,
  overflow: 'hidden',
  '@container': {
    'task-board (max-width: 9rem)': {
      gap: '0.5rem'
    }
  }
});

export const list = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.35rem',
  flex: 1,
  minHeight: 0,
  margin: 0,
  padding: 0,
  listStyle: 'none',
  overflowX: 'hidden',
  overflowY: 'auto'
});

/** Task-board selected row. */
export const taskButtonSelected = style([
  listRowButtonSelected,
  {
    selectors: {
      '&:focus': {outline: 'none'},
      '&:focus-visible': {outline: 'none'}
    }
  }
]);

// Keyboard navigation leaves `:hover` stuck on the last mouse-targeted row. See `suppressBoardHoverUntilPointerMove`.
const suppressHoverWhileKeyboardDriving = {
  [`#${TASK_BOARD_ID}[data-suppress-hover] &:hover:not(.${taskButtonSelected})`]: {
    backgroundColor: palette.surface,
    borderColor: 'transparent',
    boxShadow: 'none'
  },
  [`${darkHtmlSelector} #${TASK_BOARD_ID}[data-suppress-hover] &:hover:not(.${taskButtonSelected})`]: {
    backgroundColor: palette.surfaceDark,
    borderColor: 'transparent',
    boxShadow: 'none'
  }
} as const;

export const taskButton = style([
  listRowButton,
  {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
    width: '100%',
    textAlign: 'left',
    padding: '0.6em 0.75em',
    selectors: suppressHoverWhileKeyboardDriving,
    '@container': {
      'task-board (max-width: 9rem)': {
        gap: '0.4rem',
        padding: '0.45em 0.5em'
      }
    }
  }
]);

export const statusDot = style({
  flexShrink: 0,
  width: '0.5rem',
  height: '0.5rem',
  borderRadius: '50%',
  '@container': {
    'task-board (max-width: 9rem)': {
      display: 'none'
    }
  }
});

export const statusPending = style({
  backgroundColor: palette.border,
  ...inDarkScheme({
    backgroundColor: palette.borderDark
  })
});

export const statusInProgress = style({
  backgroundColor: palette.accent
});

export const statusDone = style({
  backgroundColor: palette.textMuted,
  ...inDarkScheme({
    backgroundColor: palette.textMutedDark
  })
});

export const taskName = style({
  flex: 1,
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  '@container': {
    'task-board (max-width: 9rem)': {
      fontSize: '0.8125rem'
    }
  }
});

export const taskNameDone = style({
  color: palette.textMuted,
  textDecoration: 'line-through',
  ...inDarkScheme({
    color: palette.textMutedDark
  })
});

export const emptyMessage = style({
  margin: 0,
  fontSize: '0.9375rem',
  color: palette.textMuted,
  ...inDarkScheme({
    color: palette.textMutedDark
  })
});

export const taskLoadError = style({
  margin: 0,
  fontSize: '0.9375rem',
  color: palette.danger
});
