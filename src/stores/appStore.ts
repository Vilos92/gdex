import {listen} from '@tauri-apps/api/event';
import {create} from 'zustand';

import {invokeErrorMessage} from '@/lib/error';
import type {NavigationPatch} from '@/lib/keyboard/taskListNavigation';
import {findTaskById, type Tasks} from '@/lib/taskApi';
import {TASK_BOARD_WIDTH_DEFAULT_PX} from '@/lib/taskBoardWidth';
import {
  applyThemeMode,
  hydrateThemeFromDisk,
  nextThemeMode,
  persistThemeMode,
  readThemeModeCache,
  syncNativeWindowTheme
} from '@/lib/theme';
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
import type {ThemeMode} from '@/schemas/theme';
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
  themeMode: ThemeMode;
  taskBoardWidthPx: number;
};

type WorkspacesUpdater = Workspaces | ((workspaces: Workspaces) => Workspaces);

type AppActions = {
  setView: (view: AppView) => void;
  setWorkspaces: (workspaces: WorkspacesUpdater) => void;
  setActiveWorkspaceId: (activeWorkspaceId: string | undefined) => void;
  /** Sidebar selection: exit transition, load tasks, enter transition. */
  switchWorkspace: (
    workspaceId: string,
    restoreActiveWorkspaceIdOnPersistFailure?: string | undefined
  ) => Promise<void>;
  /** Initial mount and programmatic activation (enter transition). */
  loadActiveWorkspaceTasks: () => Promise<void>;
  selectTask: (taskId: string) => void;
  /** Atomically update list zoom and selection (keyboard navigation). */
  setTaskListNavigation: (patch: NavigationPatch) => void;
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
  hydrateTheme: () => Promise<void>;
  cycleThemeMode: () => Promise<void>;
  handleSystemColorSchemeChange: () => void;
  setTaskBoardWidthPx: (widthPx: number) => void;
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
  themeMode: readThemeModeCache() ?? 'auto',
  taskBoardWidthPx: TASK_BOARD_WIDTH_DEFAULT_PX,

  setView: view => set({view}),

  setTaskBoardWidthPx: taskBoardWidthPx => set({taskBoardWidthPx}),

  setWorkspaces: workspaces =>
    set(state => ({
      workspaces: typeof workspaces === 'function' ? workspaces(state.workspaces) : workspaces
    })),

  setActiveWorkspaceId: activeWorkspaceId => {
    bumpTaskLoadRequest();
    set(workspaceTaskUi.activating(activeWorkspaceId));
  },

  switchWorkspace: (workspaceId, restoreActiveWorkspaceIdOnPersistFailure) =>
    switchWorkspaceWithTransition(
      set,
      get,
      workspaceId,
      restoreActiveWorkspaceIdOnPersistFailure ?? get().activeWorkspaceId
    ),

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

  setTaskListNavigation: patch => set(patch),

  zoomTo: parentId => set({zoomParentId: parentId}),

  navigateToTask: taskId => {
    if (taskId === undefined) {
      set({zoomParentId: undefined, selectedTaskId: undefined});
      return;
    }

    const task = findTaskById(get().tasks, taskId);
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

  hydrateTheme: async () => {
    const mode = await hydrateThemeFromDisk();
    set({themeMode: mode});
  },

  cycleThemeMode: async () => {
    const nextMode = nextThemeMode(get().themeMode);
    await persistThemeMode(nextMode);
    set({themeMode: nextMode});
  },

  handleSystemColorSchemeChange: () => {
    if (get().themeMode !== 'auto') {
      return;
    }
    const resolved = applyThemeMode('auto');
    syncNativeWindowTheme('auto', resolved).catch(error => {
      console.error('native window theme sync failed', error);
    });
  },

  deleteWorkspace: async workspaceId => {
    const previousWorkspaces = get().workspaces;
    await removeWorkspace(workspaceId);
    const remaining = previousWorkspaces.filter(workspace => workspace.id !== workspaceId);

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
      await get().switchWorkspace(nextWorkspace.id, nextWorkspace.id);
    } catch (error) {
      console.error('switch_workspace failed after delete', error);
      bumpTaskLoadRequest();
      set({
        workspaces: remaining,
        activeWorkspaceId: nextWorkspace.id,
        ...workspaceTaskUi.cleared()
      });
      throw error;
    }
  }
}));
