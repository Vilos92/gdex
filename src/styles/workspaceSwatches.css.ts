import {style} from '@vanilla-extract/css';

import {workspaceSwatches} from '@/styles/tokens';

/*
 * Styles.
 */

/** Per-index pastel letter colors for collapsed workspace initials. */
export const collapsedWorkspaceSwatchLetterStyles = workspaceSwatches.map(swatch =>
  style({
    color: swatch.letter,
    lineHeight: 1,
    '@media': {
      '(prefers-color-scheme: dark)': {
        color: swatch.letterDark
      }
    }
  })
);
