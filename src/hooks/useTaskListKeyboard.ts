import {useEffect, useLayoutEffect, useRef} from 'preact/hooks';
import {tinykeys} from 'tinykeys';
import {KEY_BINDINGS, type KeyAction} from '@/lib/keyboard/keyBindings';
import {
  checkIsMoveRepeatKey,
  createMoveRepeat,
  type MoveRepeatAction,
  moveRepeatActionForKey
} from '@/lib/keyboard/moveRepeat';
import {
  checkHasAgentPromptMenu,
  checkIsEditableKeyboardTarget,
  checkIsTargetInNavigationScope,
  checkIsTargetInTaskBoard,
  checkIsTargetInTaskDetail,
  checkIsTargetInWorkspaceSidebar,
  focusDetailPane,
  suppressBoardHoverUntilPointerMove,
  TASK_BOARD_ID
} from '@/lib/keyboard/scope';
import {
  applyBackAction,
  applyKeyAction,
  checkIsRedundantNavigationPatch,
  type NavigationPatch,
  type NavigationState
} from '@/lib/keyboard/taskListNavigation';
import type {Tasks} from '@/lib/taskApi';

/*
 * Types.
 */

type KeyboardContext = {
  readState: () => NavigationState;
  onApplyNavigation: (patch: NavigationPatch) => void;
};

type PendingFocusTarget = {kind: 'task'; taskId: string} | {kind: 'detail'};

type PendingFocusRef = {current: PendingFocusTarget | undefined};

const MOVE_REPEAT_ACTIONS = new Set<KeyAction>(['moveUp', 'moveDown']);

type NonMoveKeyHandler = (
  event: KeyboardEvent,
  state: NavigationState,
  onApplyNavigation: (patch: NavigationPatch) => void,
  isKeyboardDrivingRef: {current: boolean},
  pendingFocusRef: PendingFocusRef
) => void;

const NON_MOVE_KEY_HANDLERS: Partial<Record<KeyAction, NonMoveKeyHandler>> = {
  goBack: handleGoBack,
  zoomIn: handleZoomIn,
  zoomOut: handleZoomOut
};

/*
 * Hooks.
 */

export function useTaskListKeyboard({
  isEnabled,
  tasks,
  zoomParentId,
  selectedTaskId,
  onApplyNavigation
}: {
  isEnabled: boolean;
  tasks: Tasks;
  zoomParentId: string | undefined;
  selectedTaskId: string | undefined;
  onApplyNavigation: (patch: NavigationPatch) => void;
}): void {
  const contextRef = useRef<KeyboardContext>({
    readState: () => ({tasks, zoomParentId, selectedTaskId}),
    onApplyNavigation
  });

  contextRef.current = {
    readState: () => ({tasks, zoomParentId, selectedTaskId}),
    onApplyNavigation
  };

  const isKeyboardDrivingRef = useRef(false);
  const pendingFocusRef = useRef<PendingFocusTarget | undefined>(undefined);

  useLayoutEffect(() => {
    const pending = pendingFocusRef.current;
    if (!isEnabled || pending === undefined) {
      return;
    }

    pendingFocusRef.current = undefined;
    applyPendingFocus(pending);
  }, [isEnabled, selectedTaskId, zoomParentId]);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    const endKeyboardDrivingOnPointerDown = (event: PointerEvent) => {
      if (checkIsTargetInNavigationScope(event.target)) {
        isKeyboardDrivingRef.current = false;
      }
    };

    document.addEventListener('pointerdown', endKeyboardDrivingOnPointerDown);

    return () => {
      document.removeEventListener('pointerdown', endKeyboardDrivingOnPointerDown);
    };
  }, [isEnabled]);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    const readContext = (): KeyboardContext => contextRef.current;

    const moveRepeat = createMoveRepeat(action =>
      applyMoveStep(readContext(), action, isKeyboardDrivingRef, pendingFocusRef)
    );

    const onKeyDown = (event: KeyboardEvent) => {
      const moveAction = moveRepeatActionForKey(event.key);
      if (moveAction === undefined) {
        return;
      }

      if (!checkShouldHandleKey(event, isKeyboardDrivingRef)) {
        return;
      }

      event.preventDefault();

      if (event.repeat) {
        return;
      }

      moveRepeat.begin(event.key, moveAction);
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (checkIsMoveRepeatKey(event.key)) {
        moveRepeat.endIfKey(event.key);
      }
    };

    const onWindowBlur = () => {
      moveRepeat.stop();
    };

    const keyMap = Object.fromEntries(
      KEY_BINDINGS.filter(binding => !MOVE_REPEAT_ACTIONS.has(binding.action)).map(binding => [
        binding.tinykey,
        (event: KeyboardEvent) =>
          handleKey(
            event,
            binding.action,
            readContext().readState,
            readContext().onApplyNavigation,
            isKeyboardDrivingRef,
            pendingFocusRef
          )
      ])
    ) as Record<string, (event: KeyboardEvent) => void>;

    const unsubscribeTinykeys = tinykeys(window, keyMap);

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onWindowBlur);

    return () => {
      unsubscribeTinykeys();
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onWindowBlur);
      moveRepeat.stop();
    };
  }, [isEnabled]);
}

/*
 * Helpers.
 */

function applyMoveStep(
  context: KeyboardContext,
  action: MoveRepeatAction,
  isKeyboardDrivingRef: {current: boolean},
  pendingFocusRef: PendingFocusRef
): boolean {
  const patch = applyKeyAction(context.readState(), action);
  if (patch === undefined) {
    return false;
  }

  context.onApplyNavigation(patch);
  queueKeyboardFocus(patch.selectedTaskId, isKeyboardDrivingRef, pendingFocusRef);
  return true;
}

function handleKey(
  event: KeyboardEvent,
  action: KeyAction,
  readState: () => NavigationState,
  onApplyNavigation: (patch: NavigationPatch) => void,
  isKeyboardDrivingRef: {current: boolean},
  pendingFocusRef: PendingFocusRef
): void {
  if (!checkShouldHandleKey(event, isKeyboardDrivingRef)) {
    return;
  }

  const handler = NON_MOVE_KEY_HANDLERS[action];
  if (handler === undefined) {
    return;
  }

  handler(event, readState(), onApplyNavigation, isKeyboardDrivingRef, pendingFocusRef);
}

function checkShouldHandleKey(event: KeyboardEvent, isKeyboardDrivingRef: {current: boolean}): boolean {
  if (checkHasModifierKeys(event) || checkIsShortcutBlocked(event)) {
    return false;
  }

  return checkIsKeyboardNavTarget(event.target, document.activeElement) || isKeyboardDrivingRef.current;
}

function checkIsKeyboardNavTarget(...targets: readonly (EventTarget | null)[]): boolean {
  for (const target of targets) {
    if (checkIsTargetInNavigationScope(target)) {
      return true;
    }
  }
  return false;
}

function checkHasModifierKeys(event: KeyboardEvent): boolean {
  return event.metaKey || event.ctrlKey || event.altKey;
}

function checkIsShortcutBlocked(event: KeyboardEvent): boolean {
  return (
    checkHasAgentPromptMenu() ||
    checkIsEditableKeyboardTarget(event.target) ||
    checkIsTargetInWorkspaceSidebar(event.target)
  );
}

function handleZoomIn(
  event: KeyboardEvent,
  state: NavigationState,
  onApplyNavigation: (patch: NavigationPatch) => void,
  isKeyboardDrivingRef: {current: boolean},
  pendingFocusRef: PendingFocusRef
): void {
  const patch = applyKeyAction(state, 'zoomIn');
  if (patch === undefined) {
    swallowNoOpNavigationKey(event, isKeyboardDrivingRef);
    return;
  }

  const didDrillIntoSubtasks = patch.zoomParentId !== state.zoomParentId;
  if (didDrillIntoSubtasks && !checkIsTargetInTaskBoard(event.target)) {
    swallowNoOpNavigationKey(event, isKeyboardDrivingRef);
    return;
  }

  commitNavigationPatch(event, state, patch, onApplyNavigation, isKeyboardDrivingRef, pendingFocusRef);
}

function handleZoomOut(
  event: KeyboardEvent,
  state: NavigationState,
  onApplyNavigation: (patch: NavigationPatch) => void,
  isKeyboardDrivingRef: {current: boolean},
  pendingFocusRef: PendingFocusRef
): void {
  const patch = applyKeyAction(state, 'zoomOut');
  if (patch === undefined) {
    swallowNoOpNavigationKey(event, isKeyboardDrivingRef);
    return;
  }

  commitNavigationPatch(event, state, patch, onApplyNavigation, isKeyboardDrivingRef, pendingFocusRef);
}

function commitNavigationPatch(
  event: KeyboardEvent,
  state: NavigationState,
  patch: NavigationPatch,
  onApplyNavigation: (patch: NavigationPatch) => void,
  isKeyboardDrivingRef: {current: boolean},
  pendingFocusRef: PendingFocusRef
): void {
  event.preventDefault();

  if (checkIsRedundantNavigationPatch(state, patch)) {
    clearPendingFocus(pendingFocusRef);
    return;
  }

  onApplyNavigation(patch);
  queueKeyboardFocus(patch.selectedTaskId, isKeyboardDrivingRef, pendingFocusRef);
}

function swallowNoOpNavigationKey(event: KeyboardEvent, isKeyboardDrivingRef: {current: boolean}): void {
  if (!checkShouldHandleKey(event, isKeyboardDrivingRef)) {
    return;
  }

  event.preventDefault();
}

function handleGoBack(
  event: KeyboardEvent,
  state: NavigationState,
  onApplyNavigation: (patch: NavigationPatch) => void,
  isKeyboardDrivingRef: {current: boolean},
  pendingFocusRef: PendingFocusRef
): void {
  const result = applyBackAction(state, checkIsTargetInTaskDetail(event.target));
  if (result === undefined) {
    return;
  }

  event.preventDefault();

  if (result === 'focusList') {
    isKeyboardDrivingRef.current = true;
    suppressBoardHoverUntilPointerMove();
    clearPendingFocus(pendingFocusRef);
    queueMicrotask(() => focusTaskRow(state.selectedTaskId));
    return;
  }

  onApplyNavigation(result);
  queueKeyboardFocus(result.selectedTaskId, isKeyboardDrivingRef, pendingFocusRef);
}

function clearPendingFocus(pendingFocusRef: PendingFocusRef): void {
  pendingFocusRef.current = undefined;
}

function queueKeyboardFocus(
  taskId: string | undefined,
  isKeyboardDrivingRef: {current: boolean},
  pendingFocusRef: PendingFocusRef
): void {
  isKeyboardDrivingRef.current = true;
  suppressBoardHoverUntilPointerMove();
  pendingFocusRef.current = taskId === undefined ? {kind: 'detail'} : {kind: 'task', taskId};
}

function applyPendingFocus(pending: PendingFocusTarget): void {
  if (pending.kind === 'detail') {
    focusTaskRow(undefined);
    return;
  }

  focusTaskRow(pending.taskId);
}

function focusTaskRow(taskId: string | undefined): void {
  if (taskId === undefined) {
    blurTaskBoardFocus();
    focusDetailPane();
    return;
  }

  const row = document.querySelector<HTMLButtonElement>(
    `#${TASK_BOARD_ID} button[data-task-id="${CSS.escape(taskId)}"]`
  );
  row?.focus();
}

function blurTaskBoardFocus(): void {
  const active = document.activeElement;
  if (active instanceof HTMLElement && checkIsTargetInTaskBoard(active)) {
    active.blur();
  }
}
