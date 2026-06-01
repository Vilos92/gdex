import {style} from '@vanilla-extract/css';

import {darkSelector} from '@/styles/darkScheme';
import {palette} from '@/styles/tokens';

/*
 * Styles.
 */

const listRowHoverSelectors = {
  '&:hover': {
    backgroundColor: palette.accentMuted,
    borderColor: 'transparent',
    boxShadow: 'none'
  },
  [darkSelector(':hover')]: {
    backgroundColor: palette.accentMutedDark,
    borderColor: 'transparent',
    boxShadow: 'none'
  },
  '&:focus-visible': {
    outline: `2px solid ${palette.accent}`,
    outlineOffset: '2px'
  }
} as const;

/** Row control on `pageBg` panels (task board, task detail lists). */
export const listRowButton = style({
  borderRadius: '8px',
  border: `1px solid transparent`,
  backgroundColor: palette.surface,
  boxShadow: 'none',
  fontWeight: 500,
  selectors: {
    [darkSelector()]: {
      backgroundColor: palette.surfaceDark
    },
    ...listRowHoverSelectors
  }
});

/** Row control on `surface` panels (workspace sidebar). */
export const listRowButtonInset = style({
  borderRadius: '8px',
  border: `1px solid transparent`,
  backgroundColor: palette.pageBg,
  boxShadow: 'none',
  fontWeight: 500,
  selectors: {
    [darkSelector()]: {
      backgroundColor: palette.pageBgDark
    },
    ...listRowHoverSelectors
  }
});

/** Selected / active row (pairs with `listRowButton` or `listRowButtonInset`). */
export const listRowButtonSelected = style({
  backgroundColor: palette.accentMuted,
  borderColor: palette.accent,
  selectors: {
    '&:hover': {
      backgroundColor: palette.accentMuted,
      borderColor: palette.accent,
      boxShadow: 'none'
    },
    [darkSelector(':hover')]: {
      backgroundColor: palette.accentMutedDark,
      borderColor: palette.accent,
      boxShadow: 'none'
    },
    [darkSelector()]: {
      backgroundColor: palette.accentMutedDark,
      borderColor: palette.accent
    }
  }
});
