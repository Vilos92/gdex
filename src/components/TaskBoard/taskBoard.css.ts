import {style} from '@vanilla-extract/css';

/*
 * Styles.
 */

export const pane = style({
  containerType: 'inline-size',
  containerName: 'task-board',
  minWidth: 0,
  minHeight: 0,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column'
});
