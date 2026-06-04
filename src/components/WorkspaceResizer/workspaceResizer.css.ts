import {style} from '@vanilla-extract/css';

import {darkHtmlSelector, darkSelector} from '@/styles/darkScheme';
import {palette} from '@/styles/tokens';

/*
 * Styles.
 */

/** Wide gutter for pointer hit target; centered hairline via `::before` (not a scrollbar pill). */
export const handle = style({
  alignSelf: 'stretch',
  position: 'relative',
  width: '0.5rem',
  margin: 0,
  padding: 0,
  border: 'none',
  borderRadius: 0,
  backgroundColor: 'transparent',
  cursor: 'col-resize',
  touchAction: 'none',
  flexShrink: 0,
  selectors: {
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: '50%',
      width: '1px',
      borderRadius: 0,
      backgroundColor: palette.border,
      transform: 'translateX(-50%)',
      pointerEvents: 'none',
      transition: 'width 120ms ease, background-color 120ms ease'
    },
    [darkSelector('::before')]: {
      backgroundColor: palette.borderDark
    },
    '&:hover::before': {
      width: '2px',
      backgroundColor: palette.accent
    },
    [darkSelector(':hover::before')]: {
      backgroundColor: palette.accent
    },
    '&[data-dragging="true"]::before': {
      width: '2px',
      backgroundColor: palette.accent
    },
    [`${darkHtmlSelector} &[data-dragging="true"]::before`]: {
      backgroundColor: palette.accent
    }
  }
});
