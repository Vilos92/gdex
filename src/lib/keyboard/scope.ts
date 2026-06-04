/*
 * Constants.
 */

export const TASK_BOARD_ID = 'task-board';
const TASK_DETAIL_ID = 'task-detail';

/*
 * Helpers.
 */

/** True when the event target is a text field the user may be typing in. */
export function checkIsEditableKeyboardTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return (
    target.isContentEditable ||
    checkIsFormFieldElement(target) ||
    target.closest('[contenteditable="true"]') !== null
  );
}

function checkIsFormFieldElement(element: HTMLElement): boolean {
  const tag = element.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
}

/** True when the node is inside the workspace sidebar (workspace list, add panel, collapse control). */
export function checkIsTargetInWorkspaceSidebar(target: EventTarget | null): boolean {
  if (!(target instanceof Node)) {
    return false;
  }

  const sidebar = document.querySelector('[data-workspace-sidebar]');
  return sidebar?.contains(target) ?? false;
}

export function checkIsTargetInTaskBoard(target: EventTarget | null): boolean {
  if (!(target instanceof Node)) {
    return false;
  }

  const board = document.getElementById(TASK_BOARD_ID);
  return board?.contains(target) ?? false;
}

export function checkIsTargetInTaskDetail(target: EventTarget | null): boolean {
  if (!(target instanceof Node)) {
    return false;
  }

  const detail = document.getElementById(TASK_DETAIL_ID);
  return detail?.contains(target) ?? false;
}

/** Task list (left) or task detail / workspace home (right); excludes sidebar and top bar. */
export function checkIsTargetInNavigationScope(target: EventTarget | null): boolean {
  return checkIsTargetInTaskBoard(target) || checkIsTargetInTaskDetail(target);
}

export function checkHasAgentPromptMenu(): boolean {
  return document.querySelector('[role="menu"][aria-label="Quick prompts"]') !== null;
}

/** Clears sticky `:hover` on rows after keyboard navigation until the pointer moves over the board. */
export function suppressBoardHoverUntilPointerMove(): void {
  const board = document.getElementById(TASK_BOARD_ID);
  if (board === null) {
    return;
  }

  board.setAttribute('data-suppress-hover', 'true');

  const clear = () => {
    board.removeAttribute('data-suppress-hover');
    board.removeEventListener('mousemove', clear);
    board.removeEventListener('pointerdown', clear);
  };

  board.addEventListener('mousemove', clear, {once: true});
  board.addEventListener('pointerdown', clear, {once: true});
}

/** Programmatic focus for workspace home / empty selection so list shortcuts stay in scope. */
export function focusDetailPane(): void {
  const detail = document.getElementById(TASK_DETAIL_ID);
  if (detail instanceof HTMLElement) {
    detail.focus();
  }
}
