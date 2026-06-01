import {globalStyle, keyframes, style} from '@vanilla-extract/css';

/*
 * Styles.
 */

export const workspaceMain = style({
  viewTransitionName: 'workspace-main'
});

const workspaceMainExit = keyframes({
  from: {
    opacity: 1,
    transform: 'scale(1) translateY(0)'
  },
  to: {
    opacity: 0,
    transform: 'scale(0.985) translateY(6px)'
  }
});

const workspaceMainEnter = keyframes({
  from: {
    opacity: 0,
    transform: 'scale(0.985) translateY(-6px)'
  },
  to: {
    opacity: 1,
    transform: 'scale(1) translateY(0)'
  }
});

globalStyle('html:active-view-transition-type(workspace-exit) ::view-transition-old(workspace-main)', {
  animationName: workspaceMainExit,
  animationDuration: '160ms',
  animationTimingFunction: 'cubic-bezier(0.4, 0, 1, 1)',
  animationFillMode: 'both'
});

globalStyle('html:active-view-transition-type(workspace-exit) ::view-transition-new(workspace-main)', {
  animationName: workspaceMainExit,
  animationDuration: '160ms',
  animationTimingFunction: 'cubic-bezier(0.4, 0, 1, 1)',
  animationFillMode: 'both',
  opacity: 0
});

globalStyle('html:active-view-transition-type(workspace-enter) ::view-transition-old(workspace-main)', {
  animationDuration: '0ms',
  opacity: 0
});

globalStyle('html:active-view-transition-type(workspace-enter) ::view-transition-new(workspace-main)', {
  animationName: workspaceMainEnter,
  animationDuration: '220ms',
  animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
  animationFillMode: 'both'
});
