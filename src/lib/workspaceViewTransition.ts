import {invokeErrorMessage} from '@/lib/error';
import {getTasks, type Tasks} from '@/lib/taskApi';
import {checkHasViewTransition, runViewTransition} from '@/lib/viewTransition';
import {setActiveWorkspace} from '@/lib/workspaceApi';

/*
 * Types.
 */

type TaskLoadResult = {ok: true; tasks: Tasks} | {ok: false; error: unknown};

export type WorkspaceTaskPaneState = {
  tasks: Tasks;
  isTasksLoading: boolean;
  tasksLoadError: string | undefined;
  isWorkspaceMainVisible: boolean;
  selectedTaskId: string | undefined;
  zoomParentId: string | undefined;
};

export type WorkspaceTaskPaneSet = (
  partial: Partial<WorkspaceTaskPaneState & {activeWorkspaceId: string | undefined}>
) => void;

export type WorkspaceTaskPaneGet = () => {
  activeWorkspaceId: string | undefined;
  isWorkspaceMainVisible: boolean;
};

type WorkspaceTaskPaneReveal = WorkspaceTaskPaneState & {
  activeWorkspaceId?: string | undefined;
};

/*
 * Helpers.
 */

let tasksLoadRequestId = 0;

/** Bumps and returns the current task-load generation (stale loads bail when a newer switch wins). */
export function bumpTaskLoadRequest(): number {
  return ++tasksLoadRequestId;
}

function checkIsStaleTaskLoadRequest(requestId: number): boolean {
  return requestId !== tasksLoadRequestId;
}

/** Named task-pane state slices so switch, boot, and clear paths stay aligned. */
export const workspaceTaskUi = {
  exiting(workspaceId: string): WorkspaceTaskPaneState & {activeWorkspaceId: string} {
    return {
      activeWorkspaceId: workspaceId,
      isWorkspaceMainVisible: false,
      tasks: [],
      isTasksLoading: true,
      tasksLoadError: undefined,
      selectedTaskId: undefined,
      zoomParentId: undefined
    };
  },

  activating(
    activeWorkspaceId: string | undefined
  ): WorkspaceTaskPaneState & {activeWorkspaceId: string | undefined} {
    return {
      activeWorkspaceId,
      tasks: [],
      isTasksLoading: activeWorkspaceId !== undefined,
      isWorkspaceMainVisible: activeWorkspaceId === undefined,
      tasksLoadError: undefined,
      selectedTaskId: undefined,
      zoomParentId: undefined
    };
  },

  awaitingFirstLoad(activeWorkspaceId: string): WorkspaceTaskPaneState & {activeWorkspaceId: string} {
    return {
      activeWorkspaceId,
      tasks: [],
      isTasksLoading: true,
      isWorkspaceMainVisible: false,
      tasksLoadError: undefined,
      selectedTaskId: undefined,
      zoomParentId: undefined
    };
  },

  cleared(): WorkspaceTaskPaneState {
    return {
      tasks: [],
      isTasksLoading: false,
      isWorkspaceMainVisible: true,
      tasksLoadError: undefined,
      selectedTaskId: undefined,
      zoomParentId: undefined
    };
  },

  revealed(loadResult: TaskLoadResult): WorkspaceTaskPaneState {
    if (loadResult.ok) {
      return {
        tasks: loadResult.tasks,
        tasksLoadError: undefined,
        isTasksLoading: false,
        isWorkspaceMainVisible: true,
        selectedTaskId: undefined,
        zoomParentId: undefined
      };
    }

    console.error('get_tasks failed', loadResult.error);
    return {
      tasks: [],
      tasksLoadError: invokeErrorMessage(loadResult.error, 'Could not load tasks.'),
      isTasksLoading: false,
      isWorkspaceMainVisible: true,
      selectedTaskId: undefined,
      zoomParentId: undefined
    };
  },

  persistFailed(error: unknown): WorkspaceTaskPaneState {
    return {
      tasks: [],
      tasksLoadError: invokeErrorMessage(error, 'Could not set active workspace.'),
      isTasksLoading: false,
      isWorkspaceMainVisible: true,
      selectedTaskId: undefined,
      zoomParentId: undefined
    };
  }
};

export function beginTaskLoad(set: WorkspaceTaskPaneSet): number {
  const requestId = bumpTaskLoadRequest();
  set({isTasksLoading: true, tasksLoadError: undefined});
  return requestId;
}

export async function loadTasksForWorkspace(
  workspaceId: string
): Promise<{ok: true; tasks: Tasks} | {ok: false; error: unknown}> {
  try {
    const tasks = await getTasks(workspaceId);
    return {ok: true, tasks};
  } catch (error) {
    return {ok: false, error};
  }
}

export function applySilentTaskLoad(
  set: WorkspaceTaskPaneSet,
  requestId: number,
  loadResult: {ok: true; tasks: Tasks} | {ok: false; error: unknown}
): void {
  if (checkIsStaleTaskLoadRequest(requestId)) {
    return;
  }

  if (loadResult.ok) {
    set({tasks: loadResult.tasks, isTasksLoading: false});
    return;
  }

  console.error('get_tasks failed', loadResult.error);
  set({
    tasks: [],
    tasksLoadError: invokeErrorMessage(loadResult.error, 'Could not load tasks.'),
    isTasksLoading: false
  });
}

/**
 * Sidebar project change: exit transition → persist + load → enter transition.
 * Phase 1 — animate the main pane out and hide task UI.
 * Phase 2 — persist the workspace and fetch its tasks.
 * Phase 3 — animate the main pane in with loaded (or error) content.
 */
export async function switchWorkspaceWithTransition(
  set: WorkspaceTaskPaneSet,
  get: WorkspaceTaskPaneGet,
  workspaceId: string,
  restoreOnPersistFailure: string | undefined
): Promise<void> {
  if (workspaceId === get().activeWorkspaceId) {
    return;
  }

  const requestId = bumpTaskLoadRequest();
  await exitWorkspaceMain(set, get, workspaceId);

  if (checkIsStaleTaskLoadRequest(requestId)) {
    return;
  }

  await persistActiveWorkspace(set, requestId, workspaceId, restoreOnPersistFailure);

  await loadAndRevealWorkspace(set, requestId, workspaceId);
}

/** Load tasks and reveal the main pane with an enter transition when supported. */
export async function loadActiveWorkspaceWithTransition(
  set: WorkspaceTaskPaneSet,
  activeWorkspaceId: string
): Promise<void> {
  const requestId = beginTaskLoad(set);
  await loadAndRevealWorkspace(set, requestId, activeWorkspaceId);
}

async function loadAndRevealWorkspace(
  set: WorkspaceTaskPaneSet,
  requestId: number,
  workspaceId: string
): Promise<void> {
  if (checkIsStaleTaskLoadRequest(requestId)) {
    return;
  }

  const loadResult = await loadTasksForWorkspace(workspaceId);
  await revealWorkspaceMain(set, requestId, workspaceTaskUi.revealed(loadResult));
}

async function exitWorkspaceMain(
  set: WorkspaceTaskPaneSet,
  get: WorkspaceTaskPaneGet,
  workspaceId: string
): Promise<void> {
  const applyExitState = () => {
    set(workspaceTaskUi.exiting(workspaceId));
  };

  if (get().isWorkspaceMainVisible) {
    await runViewTransition('workspace-exit', applyExitState);
    return;
  }

  applyExitState();
}

async function persistActiveWorkspace(
  set: WorkspaceTaskPaneSet,
  requestId: number,
  workspaceId: string,
  restoreActiveWorkspaceId: string | undefined
): Promise<void> {
  try {
    await setActiveWorkspace(workspaceId);
  } catch (error) {
    console.error('set_active_workspace failed', error);
    const rollbackState: WorkspaceTaskPaneReveal = {
      ...workspaceTaskUi.persistFailed(error),
      activeWorkspaceId: restoreActiveWorkspaceId
    };
    await revealWorkspaceMain(set, requestId, rollbackState);
    throw error;
  }
}

async function revealWorkspaceMain(
  set: WorkspaceTaskPaneSet,
  requestId: number,
  nextUi: WorkspaceTaskPaneReveal
): Promise<void> {
  if (checkIsStaleTaskLoadRequest(requestId)) {
    return;
  }

  const applyRevealState = () => {
    if (checkIsStaleTaskLoadRequest(requestId)) {
      return;
    }
    set(nextUi);
  };

  if (checkHasViewTransition()) {
    await runViewTransition('workspace-enter', applyRevealState);
    return;
  }

  applyRevealState();
}
