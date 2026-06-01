import {style} from '@vanilla-extract/css';

import {inDarkScheme} from '@/styles/darkScheme';
import {workspaceSwatches} from '@/styles/tokens';

/*
 * Styles.
 */

/** Per-index pastel letter colors for collapsed workspace initials. */
export const collapsedWorkspaceSwatchLetterStyles = workspaceSwatches.map(swatch =>
  style({
    color: swatch.letter,
    ...inDarkScheme({
      color: swatch.letterDark
    })
  })
);
