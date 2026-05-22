import {listen} from '@tauri-apps/api/event';
import {create} from 'zustand';

import {invokeErrorMessage} from '@/lib/error';
import {listProjects} from '@/lib/projectApi';
import {loadProjectSelection} from '@/lib/projectSelection';
import {getTasks, type Tasks} from '@/lib/taskApi';
import type {Projects} from '@/schemas/project';

/*
 * Types.
 */

export type AppView = 'loading' | 'splash' | 'projects' | 'error';

type AppData = {
  view: AppView;
  projectsLoadError: string | undefined;
  projects: Projects;
  activeProjectId: string | undefined;
  tasks: Tasks;
  isTasksLoading: boolean;
  tasksLoadError: string | undefined;
  selectedTaskId: string | undefined;
  zoomParentId: string | undefined;
};

type AppActions = {
  setView: (view: AppView) => void;
  setProjects: (projects: Projects) => void;
  setActiveProjectId: (activeProjectId: string | undefined) => void;
  selectTask: (taskId: string) => void;
  zoomTo: (parentId: string | undefined) => void;
  reloadProjects: () => Promise<void>;
  handleProjectsLoadError: (error: unknown) => void;
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
  projectsLoadError: undefined,
  projects: [],
  activeProjectId: undefined,
  tasks: [],
  isTasksLoading: false,
  tasksLoadError: undefined,
  selectedTaskId: undefined,
  zoomParentId: undefined,

  setView: view => set({view}),

  setProjects: projects => set({projects}),

  setActiveProjectId: activeProjectId => {
    tasksLoadRequestId += 1;
    set({
      activeProjectId,
      tasks: [],
      isTasksLoading: false,
      tasksLoadError: undefined,
      selectedTaskId: undefined,
      zoomParentId: undefined
    });
  },

  selectTask: taskId => set({selectedTaskId: taskId}),

  zoomTo: parentId => set({zoomParentId: parentId}),

  reloadProjects: async () => {
    const loadedProjects = await listProjects();
    if (loadedProjects.length === 0) {
      set({projects: [], activeProjectId: undefined, projectsLoadError: undefined, view: 'splash'});
      return;
    }

    const activeId = await loadProjectSelection(loadedProjects);
    set({
      projects: loadedProjects,
      activeProjectId: activeId,
      projectsLoadError: undefined,
      view: 'projects'
    });
  },

  handleProjectsLoadError: error => {
    console.error('project load failed', error);
    set({
      projectsLoadError: invokeErrorMessage(error, 'Could not load projects.'),
      view: 'error'
    });
  },

  reloadTasks: async () => {
    const {activeProjectId} = get();
    const setTaskLoad: SetTaskLoadState = partial => set(partial);

    if (activeProjectId === undefined) {
      clearTasksForNoProject(setTaskLoad);
      return;
    }

    const requestId = beginTaskLoad(setTaskLoad);
    const loadResult = await loadTasksForProject(activeProjectId);
    applyTaskLoadResult(setTaskLoad, requestId, loadResult);
  },

  initTasksListener: () => {
    let disposed = false;
    let unlisten: (() => void) | undefined;

    const subscribe = async () => {
      const stop = await listen<string>('tasks-changed', event => {
        if (event.payload === get().activeProjectId) {
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

function clearTasksForNoProject(setTaskLoad: SetTaskLoadState): void {
  tasksLoadRequestId += 1;
  setTaskLoad({tasks: [], tasksLoadError: undefined, isTasksLoading: false});
}

function beginTaskLoad(setTaskLoad: SetTaskLoadState): number {
  const requestId = ++tasksLoadRequestId;
  setTaskLoad({isTasksLoading: true, tasksLoadError: undefined});
  return requestId;
}

async function loadTasksForProject(projectId: string): Promise<TaskLoadResult> {
  try {
    const tasks = await getTasks(projectId);
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
