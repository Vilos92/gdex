import {compareTasks, findTaskById, type Task, type Tasks} from '@/lib/taskApi';
import {sortedTasksAtLevel} from '@/lib/taskLevel';

/*
 * Types.
 */

/** Snapshot read by the keyboard hook; mirrors task-board zoom + list selection in the store. */
export type NavigationState = {
  tasks: Tasks;
  zoomParentId: string | undefined;
  selectedTaskId: string | undefined;
};

/** Atomic zoom/selection write applied via `setTaskListNavigation` so list and detail stay in sync. */
export type NavigationPatch = {
  zoomParentId: string | undefined;
  selectedTaskId: string | undefined;
};

/** `focusList` only moves focus; a patch also updates store state (breadcrumb / selection). */
export type BackResult = 'focusList' | NavigationPatch;

/*
 * Helpers.
 */

/** Maps a bound key action to the next store patch; `undefined` means the key is a no-op (caller may still `preventDefault`). */
export function applyKeyAction(
  state: NavigationState,
  action: 'moveUp' | 'moveDown' | 'zoomIn' | 'zoomOut'
): NavigationPatch | undefined {
  switch (action) {
    case 'moveUp':
      return patchForMove(state, -1);
    case 'moveDown':
      return patchForMove(state, 1);
    case 'zoomIn':
      return patchForZoomIn(state);
    case 'zoomOut':
      return patchForZoomOut(state);
  }
}

/** Skips re-applying state and re-focusing when the patch would not change anything (avoids a double highlight on repeated `→`). */
export function checkIsRedundantNavigationPatch(state: NavigationState, patch: NavigationPatch): boolean {
  return state.zoomParentId === patch.zoomParentId && state.selectedTaskId === patch.selectedTaskId;
}

/**
 * Backspace is two-step: leave the detail pane first (`focusList`), then walk up the breadcrumb like `h`/`←`.
 * `undefined` at workspace home with nothing selected.
 */
export function applyBackAction(
  state: NavigationState,
  isTargetInTaskDetail: boolean
): BackResult | undefined {
  if (isTargetInTaskDetail) {
    return 'focusList';
  }

  const patch = patchForZoomOut(state);
  if (patch === undefined) {
    return undefined;
  }

  return patch;
}

/** Moves among siblings at the current zoom only; does not open subtasks. */
function patchForMove(state: NavigationState, delta: -1 | 1): NavigationPatch | undefined {
  const levelTasks = sortedTasksAtLevel(state.tasks, state.zoomParentId);
  if (levelTasks.length === 0) {
    return undefined;
  }

  const nextId = resolveMoveTargetId(levelTasks, state.selectedTaskId, delta);
  if (nextId === undefined) {
    return undefined;
  }

  return {
    zoomParentId: state.zoomParentId,
    selectedTaskId: nextId
  };
}

/** Clamps at list ends; with no selection, down picks the first row and up picks the last (sorted order). */
function resolveMoveTargetId(
  levelTasks: Tasks,
  selectedTaskId: string | undefined,
  delta: -1 | 1
): string | undefined {
  if (selectedTaskId === undefined) {
    const index = delta === 1 ? 0 : levelTasks.length - 1;
    return levelTasks[index]?.id;
  }

  const currentIndex = levelTasks.findIndex(task => task.id === selectedTaskId);
  if (currentIndex === -1) {
    return levelTasks[0]?.id;
  }

  const nextIndex = currentIndex + delta;
  if (nextIndex < 0 || nextIndex >= levelTasks.length) {
    return selectedTaskId;
  }

  return levelTasks[nextIndex]?.id;
}

/**
 * `→`/`l`: from home with no selection, select the first root task; with a row selected, drill into subtasks
 * (first child by sort). No-op when the row has no children so extra presses do not re-trigger focus styling.
 */
function patchForZoomIn(state: NavigationState): NavigationPatch | undefined {
  const levelTasks = sortedTasksAtLevel(state.tasks, state.zoomParentId);
  const selected = resolveSelectedTask(state);
  if (selected === undefined) {
    const firstId = levelTasks[0]?.id;
    if (firstId === undefined) {
      return undefined;
    }

    return {
      zoomParentId: state.zoomParentId,
      selectedTaskId: firstId
    };
  }

  const childTasks = sortedChildTasks(state.tasks, selected);
  if (childTasks.length === 0) {
    return undefined;
  }

  return {
    zoomParentId: selected.id,
    selectedTaskId: childTasks[0]?.id
  };
}

/** `←`/`h`: one breadcrumb level up, or clear root selection when already at the workspace task list home. */
function patchForZoomOut(state: NavigationState): NavigationPatch | undefined {
  if (state.zoomParentId !== undefined) {
    return {
      zoomParentId: findTaskById(state.tasks, state.zoomParentId)?.parentId,
      selectedTaskId: state.zoomParentId
    };
  }

  if (state.selectedTaskId !== undefined) {
    return {
      zoomParentId: undefined,
      selectedTaskId: undefined
    };
  }

  return undefined;
}

function resolveSelectedTask(state: NavigationState): Task | undefined {
  if (state.selectedTaskId === undefined) {
    return undefined;
  }
  return findTaskById(state.tasks, state.selectedTaskId);
}

/** Child order follows `parent.children` ids, then `compareTasks` so keyboard matches visible list order. */
function sortedChildTasks(tasks: Tasks, parent: Task): Tasks {
  const byId = new Map(tasks.map(task => [task.id, task]));
  const children: Task[] = [];
  for (const childId of parent.children) {
    const child = byId.get(childId);
    if (child !== undefined) {
      children.push(child);
    }
  }
  return children.sort(compareTasks);
}
