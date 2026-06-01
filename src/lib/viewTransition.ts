import {flushSync} from 'preact/compat';

/*
 * Types.
 */

type WorkspaceViewTransitionType = 'workspace-exit' | 'workspace-enter';

/*
 * Helpers.
 */

/** Same-document view transitions, skipped when unsupported or reduced motion is preferred. */
export function checkHasViewTransition(): boolean {
  return 'startViewTransition' in document && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Runs a DOM update inside a typed view transition when available. */
export function runViewTransition(type: WorkspaceViewTransitionType, update: () => void): Promise<void> {
  if (!checkHasViewTransition()) {
    update();
    return Promise.resolve();
  }

  const transition = document.startViewTransition(() => {
    flushSync(update);
  });
  if ('types' in transition) {
    (transition as ViewTransition & {types: {add: (type: string) => void}}).types.add(type);
  }

  return transition.finished.catch(() => undefined);
}
