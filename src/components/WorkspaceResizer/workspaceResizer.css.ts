import {style} from '@vanilla-extract/css';

import {darkHtmlSelector, darkSelector} from '@/styles/darkScheme';
import {palette} from '@/styles/tokens';

/*
 * Styles.
 */

export const handle = style({
  alignSelf: 'stretch',
  width: '0.5rem',
  margin: 0,
  padding: 0,
  border: 'none',
  borderRadius: '4px',
  backgroundColor: palette.border,
  cursor: 'col-resize',
  touchAction: 'none',
  flexShrink: 0,
  selectors: {
    [darkSelector()]: {
      backgroundColor: palette.borderDark
    },
    '&:hover': {
      backgroundColor: palette.accentMuted
    },
    [darkSelector(':hover')]: {
      backgroundColor: palette.accentMutedDark
    },
    '&[data-dragging="true"]': {
      backgroundColor: palette.accentMuted
    },
    [`${darkHtmlSelector} &[data-dragging="true"]`]: {
      backgroundColor: palette.accentMutedDark
    }
  }
});
