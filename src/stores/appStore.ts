import {listen} from '@tauri-apps/api/event';
import {create} from 'zustand';

import {invokeErrorMessage} from '@/lib/error';
import {getTasks, type Tasks} from '@/lib/taskApi';
import {listWorkspaces} from '@/lib/workspaceApi';
import {loadWorkspaceSelection} from '@/lib/workspaceSelection';
import type {Workspaces} from '@/schemas/workspace';

/*
 * Types.
 */

export type AppView = 'loading' | 'splash' | 'workspaces' | 'error';

type AppData = {
  view: AppView;
  workspacesLoadError: string | undefined;
  workspaces: Workspaces;
  activeWorkspaceId: string | undefined;
  tasks: Tasks;
  isTasksLoading: boolean;
  tasksLoadError: string | undefined;
  selectedTaskId: string | undefined;
  zoomParentId: string | undefined;
};

type WorkspacesUpdater = Workspaces | ((workspaces: Workspaces) => Workspaces);

type AppActions = {
  setView: (view: AppView) => void;
  setWorkspaces: (workspaces: WorkspacesUpdater) => void;
  setActiveWorkspaceId: (activeWorkspaceId: string | undefined) => void;
  selectTask: (taskId: string) => void;
  zoomTo: (parentId: string | undefined) => void;
  /** Set list zoom and detail selection together (breadcrumb navigation). */
  navigateToTask: (taskId: string | undefined) => void;
  reloadWorkspaces: () => Promise<void>;
  handleWorkspacesLoadError: (error: unknown) => void;
  reloadTasks: () => Promise<void>;
  /** Subscribe to `tasks-changed`; returns cleanup that unlistens. */
  initTasksListener: () => () => void;
};

type AppState = AppData & AppActions;

type TaskLoadSlice = Pick<AppData, 'tasks' | 'isTasksLoading' | 'tasksLoadError'>;

type SetTaskLoadState = (partial: Partial<TaskLoadSlice>) => void;

type TaskLoadResult = {ok: true; tasks: Tasks} | {ok: false; error: unknown};

/*
 * Store.
 */

let tasksLoadRequestId = 0;

export const useAppStore = create<AppState>((set, get) => ({
  view: 'loading',
  workspacesLoadError: undefined,
  workspaces: [],
  activeWorkspaceId: undefined,
  tasks: [],
  isTasksLoading: false,
  tasksLoadError: undefined,
  selectedTaskId: undefined,
  zoomParentId: undefined,

  setView: view => set({view}),

  setWorkspaces: workspaces =>
    set(state => ({
      workspaces: typeof workspaces === 'function' ? workspaces(state.workspaces) : workspaces
    })),

  setActiveWorkspaceId: activeWorkspaceId => {
    tasksLoadRequestId += 1;
    set({
      activeWorkspaceId,
      tasks: [],
      isTasksLoading: false,
      tasksLoadError: undefined,
      selectedTaskId: undefined,
      zoomParentId: undefined
    });
  },

  selectTask: taskId => set({selectedTaskId: taskId}),

  zoomTo: parentId => set({zoomParentId: parentId}),

  navigateToTask: taskId => {
    if (taskId === undefined) {
      set({zoomParentId: undefined, selectedTaskId: undefined});
      return;
    }

    const task = get().tasks.find(row => row.id === taskId);
    set({zoomParentId: task?.parentId, selectedTaskId: taskId});
  },

  reloadWorkspaces: async () => {
    const loadedWorkspaces = await listWorkspaces();
    if (loadedWorkspaces.length === 0) {
      tasksLoadRequestId += 1;
      set({
        workspaces: [],
        activeWorkspaceId: undefined,
        workspacesLoadError: undefined,
        view: 'splash',
        tasks: [],
        isTasksLoading: false,
        tasksLoadError: undefined,
        selectedTaskId: undefined,
        zoomParentId: undefined
      });
      return;
    }

    const activeId = await loadWorkspaceSelection(loadedWorkspaces);
    set({
      workspaces: loadedWorkspaces,
      activeWorkspaceId: activeId,
      workspacesLoadError: undefined,
      view: 'workspaces'
    });
  },

  handleWorkspacesLoadError: error => {
    console.error('workspace load failed', error);
    set({
      workspacesLoadError: invokeErrorMessage(error, 'Could not load workspaces.'),
      view: 'error'
    });
  },

  reloadTasks: async () => {
    const {activeWorkspaceId} = get();
    const setTaskLoad: SetTaskLoadState = partial => set(partial);

    if (activeWorkspaceId === undefined) {
      clearTasksForNoWorkspace(setTaskLoad);
      return;
    }

    const requestId = beginTaskLoad(setTaskLoad);
    const loadResult = await loadTasksForWorkspace(activeWorkspaceId);
    applyTaskLoadResult(setTaskLoad, requestId, loadResult);
  },

  initTasksListener: () => {
    let disposed = false;
    let unlisten: (() => void) | undefined;

    const subscribe = async () => {
      const stop = await listen<string>('tasks-changed', event => {
        if (event.payload === get().activeWorkspaceId) {
          get().reloadTasks();
        }
      });
      if (disposed) {
        stop();
        return;
      }
      unlisten = stop;
    };

    subscribe().catch(error => {
      console.error('tasks-changed listener failed', error);
    });

    return () => {
      disposed = true;
      unlisten?.();
    };
  }
}));

/*
 * Helpers.
 */

function clearTasksForNoWorkspace(setTaskLoad: SetTaskLoadState): void {
  tasksLoadRequestId += 1;
  setTaskLoad({tasks: [], tasksLoadError: undefined, isTasksLoading: false});
}

function beginTaskLoad(setTaskLoad: SetTaskLoadState): number {
  const requestId = ++tasksLoadRequestId;
  setTaskLoad({isTasksLoading: true, tasksLoadError: undefined});
  return requestId;
}

async function loadTasksForWorkspace(workspaceId: string): Promise<TaskLoadResult> {
  try {
    const tasks = await getTasks(workspaceId);
    return {ok: true, tasks};
  } catch (error) {
    return {ok: false, error};
  }
}

function applyTaskLoadResult(
  setTaskLoad: SetTaskLoadState,
  requestId: number,
  loadResult: TaskLoadResult
): void {
  if (requestId !== tasksLoadRequestId) {
    return;
  }

  if (loadResult.ok) {
    setTaskLoad({tasks: loadResult.tasks});
  } else {
    console.error('get_tasks failed', loadResult.error);
    setTaskLoad({
      tasksLoadError: invokeErrorMessage(loadResult.error, 'Could not load tasks.'),
      tasks: []
    });
  }

  if (requestId === tasksLoadRequestId) {
    setTaskLoad({isTasksLoading: false});
  }
}
