import {style} from '@vanilla-extract/css';

import {palette} from '@/styles/tokens';

export {section, sectionLabel} from '@/components/panelSection.css';

/*
 * Styles.
 */

export const panel = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
  flex: '1 1 0',
  alignSelf: 'stretch',
  minWidth: 0,
  minHeight: 0,
  overflowY: 'auto',
  overflowWrap: 'anywhere'
});

export const emptyMessage = style({
  margin: 0,
  fontSize: '0.9375rem',
  color: palette.textMuted,
  '@media': {
    '(prefers-color-scheme: dark)': {
      color: palette.textMutedDark
    }
  }
});

export const title = style({
  margin: 0,
  fontSize: '1.375rem',
  fontWeight: 600,
  letterSpacing: '-0.02em',
  lineHeight: 1.3
});

export const titleDone = style({
  color: palette.textMuted,
  textDecoration: 'line-through',
  '@media': {
    '(prefers-color-scheme: dark)': {
      color: palette.textMutedDark
    }
  }
});

export const statusRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem'
});

export const statusBadge = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.4rem',
  padding: '0.25em 0.65em',
  borderRadius: '999px',
  fontSize: '0.8125rem',
  fontWeight: 500,
  border: '1px solid transparent'
});

export const statusBadgePending = style({
  color: palette.textMuted,
  backgroundColor: palette.pageBg,
  borderColor: palette.border,
  '@media': {
    '(prefers-color-scheme: dark)': {
      color: palette.textMutedDark,
      backgroundColor: palette.pageBgDark,
      borderColor: palette.borderDark
    }
  }
});

export const statusBadgeInProgress = style({
  color: palette.accent,
  backgroundColor: palette.accentMuted,
  borderColor: palette.accent,
  '@media': {
    '(prefers-color-scheme: dark)': {
      backgroundColor: palette.accentMutedDark,
      borderColor: palette.accent
    }
  }
});

export const statusBadgeDone = style({
  color: palette.textMuted,
  backgroundColor: palette.pageBg,
  borderColor: palette.border,
  '@media': {
    '(prefers-color-scheme: dark)': {
      color: palette.textMutedDark,
      backgroundColor: palette.pageBgDark,
      borderColor: palette.borderDark
    }
  }
});

export const sectionBody = style({
  margin: 0,
  fontSize: '0.9375rem',
  lineHeight: 1.55,
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word'
});

export const blockedList = style({
  margin: 0,
  paddingLeft: '1.25rem',
  fontSize: '0.9375rem',
  lineHeight: 1.5
});

export const childTasksSection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  marginTop: '0.25rem'
});

export const childTaskButton = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '0.65rem',
  width: '100%',
  textAlign: 'left',
  padding: '0.6em 0.75em',
  borderRadius: '8px',
  border: `1px solid transparent`,
  backgroundColor: 'transparent',
  boxShadow: 'none',
  fontWeight: 500
});

export const childTaskName = style({
  flex: 1,
  minWidth: 0,
  lineHeight: 1.4,
  wordBreak: 'break-word'
});

export const childTaskNameDone = style({
  color: palette.textMuted,
  textDecoration: 'line-through',
  '@media': {
    '(prefers-color-scheme: dark)': {
      color: palette.textMutedDark
    }
  }
});

export const childTasksList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.35rem',
  margin: 0,
  padding: 0,
  listStyle: 'none'
});

export const taskIdButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.3em',
  padding: '0.15em 0.4em',
  marginTop: '0.1rem',
  background: 'none',
  border: '1px solid transparent',
  borderRadius: '4px',
  fontFamily: 'monospace',
  fontSize: '0.6875rem',
  letterSpacing: '0.02em',
  color: palette.textMuted,
  cursor: 'pointer',
  transition: 'color 120ms, border-color 120ms, background-color 120ms',
  ':hover': {
    color: palette.text,
    borderColor: palette.border,
    backgroundColor: palette.pageBg
  },
  '@media': {
    '(prefers-color-scheme: dark)': {
      color: palette.textMutedDark,
      ':hover': {
        color: palette.textDark,
        borderColor: palette.borderDark,
        backgroundColor: palette.pageBgDark
      }
    }
  }
});

export const taskIdCopied = style({
  color: palette.accent,
  '@media': {
    '(prefers-color-scheme: dark)': {
      color: palette.accent
    }
  }
});
