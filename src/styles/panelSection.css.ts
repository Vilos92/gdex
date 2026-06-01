import {style} from '@vanilla-extract/css';

import {inDarkScheme} from '@/styles/darkScheme';
import {palette} from '@/styles/tokens';

/*
 * Styles.
 */

/** Flex column container for a labelled detail section in a side panel. */
export const section = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.4rem',
  minWidth: 0
});

/** All-caps muted label above a detail section. */
export const sectionLabel = style({
  margin: 0,
  fontSize: '0.75rem',
  fontWeight: 600,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: palette.textMuted,
  ...inDarkScheme({
    color: palette.textMutedDark
  })
});
