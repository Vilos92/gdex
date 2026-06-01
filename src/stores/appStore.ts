import {listen} from '@tauri-apps/api/event';
import {create} from 'zustand';

import {invokeErrorMessage} from '@/lib/error';
import type {Tasks} from '@/lib/taskApi';
import {listWorkspaces, removeWorkspace} from '@/lib/workspaceApi';
import {loadWorkspaceSelection} from '@/lib/workspaceSelection';
import {
  applySilentTaskLoad,
  beginTaskLoad,
  bumpTaskLoadRequest,
  loadActiveWorkspaceWithTransition,
  loadTasksForWorkspace,
  switchWorkspaceWithTransition,
  workspaceTaskUi
} from '@/lib/workspaceViewTransition';
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
  isWorkspaceMainVisible: boolean;
  selectedTaskId: string | undefined;
  zoomParentId: string | undefined;
};

type WorkspacesUpdater = Workspaces | ((workspaces: Workspaces) => Workspaces);

type AppActions = {
  setView: (view: AppView) => void;
  setWorkspaces: (workspaces: WorkspacesUpdater) => void;
  setActiveWorkspaceId: (activeWorkspaceId: string | undefined) => void;
  /** Sidebar selection: exit transition, load tasks, enter transition. */
  switchWorkspace: (workspaceId: string) => Promise<void>;
  /** Initial mount and programmatic activation (enter transition). */
  loadActiveWorkspaceTasks: () => Promise<void>;
  selectTask: (taskId: string) => void;
  zoomTo: (parentId: string | undefined) => void;
  /** Set list zoom and detail selection together (breadcrumb navigation). */
  navigateToTask: (taskId: string | undefined) => void;
  reloadWorkspaces: () => Promise<void>;
  handleWorkspacesLoadError: (error: unknown) => void;
  reloadTasks: () => Promise<void>;
  /** Subscribe to `tasks-changed`; returns cleanup that unlistens. */
  initTasksListener: () => () => void;
  /**
   * Remove a workspace from the registry. If no workspaces remain, switches to the splash view.
   * If at least one workspace remains, the first one is activated.
   */
  deleteWorkspace: (workspaceId: string) => Promise<void>;
};

type AppState = AppData & AppActions;

/*
 * Store.
 */

export const useAppStore = create<AppState>((set, get) => ({
  view: 'loading',
  workspacesLoadError: undefined,
  workspaces: [],
  activeWorkspaceId: undefined,
  tasks: [],
  isTasksLoading: false,
  tasksLoadError: undefined,
  isWorkspaceMainVisible: true,
  selectedTaskId: undefined,
  zoomParentId: undefined,

  setView: view => set({view}),

  setWorkspaces: workspaces =>
    set(state => ({
      workspaces: typeof workspaces === 'function' ? workspaces(state.workspaces) : workspaces
    })),

  setActiveWorkspaceId: activeWorkspaceId => {
    bumpTaskLoadRequest();
    set(workspaceTaskUi.activating(activeWorkspaceId));
  },

  switchWorkspace: workspaceId => switchWorkspaceWithTransition(set, get, workspaceId),

  loadActiveWorkspaceTasks: async () => {
    const {activeWorkspaceId} = get();

    if (activeWorkspaceId === undefined) {
      bumpTaskLoadRequest();
      set(workspaceTaskUi.cleared());
      return;
    }

    await loadActiveWorkspaceWithTransition(set, activeWorkspaceId);
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
      bumpTaskLoadRequest();
      set({
        workspaces: [],
        activeWorkspaceId: undefined,
        workspacesLoadError: undefined,
        view: 'splash',
        ...workspaceTaskUi.cleared()
      });
      return;
    }

    const activeId = await loadWorkspaceSelection(loadedWorkspaces);
    if (activeId === undefined) {
      return;
    }

    bumpTaskLoadRequest();
    set({
      workspaces: loadedWorkspaces,
      workspacesLoadError: undefined,
      view: 'workspaces',
      ...workspaceTaskUi.awaitingFirstLoad(activeId)
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

    if (activeWorkspaceId === undefined) {
      bumpTaskLoadRequest();
      set(workspaceTaskUi.cleared());
      return;
    }

    const requestId = beginTaskLoad(set);
    const loadResult = await loadTasksForWorkspace(activeWorkspaceId);
    applySilentTaskLoad(set, requestId, loadResult);
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
  },

  deleteWorkspace: async workspaceId => {
    await removeWorkspace(workspaceId);
    const remaining = get().workspaces.filter(workspace => workspace.id !== workspaceId);

    if (remaining.length === 0) {
      bumpTaskLoadRequest();
      set({
        workspaces: [],
        activeWorkspaceId: undefined,
        workspacesLoadError: undefined,
        view: 'splash',
        ...workspaceTaskUi.cleared()
      });
      return;
    }

    // Switch to a remaining workspace. Prefer the next workspace after the deleted one, fall
    // back to the first in the list.
    const nextWorkspace = remaining[0];
    set({workspaces: remaining});
    try {
      await get().switchWorkspace(nextWorkspace.id);
    } catch (error) {
      console.error('switch_workspace failed after delete', error);
    }
  }
}));
