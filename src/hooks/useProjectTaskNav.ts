import {useState} from 'preact/hooks';

/*
 * Types.
 */

type ProjectTaskNav = {
  projectId: string;
  selectedTaskId: string | undefined;
  zoomParentId: string | undefined;
};

/*
 * Hooks.
 */

/** Task list selection and zoom level, scoped to the active project (derived on project switch). */
export function useProjectTaskNav(activeProjectId: string | undefined) {
  const [taskNav, setTaskNav] = useState<ProjectTaskNav | undefined>(undefined);

  const activeTaskNav = resolveActiveTaskNav(taskNav, activeProjectId);
  const selectedTaskId = activeTaskNav?.selectedTaskId;
  const zoomParentId = activeTaskNav?.zoomParentId;

  if (activeProjectId === undefined) {
    return {
      selectedTaskId: undefined,
      zoomParentId: undefined,
      selectTask: () => {},
      zoomTo: () => {}
    };
  }

  const projectId = activeProjectId;

  const selectTask = (taskId: string) => {
    setTaskNav(previous => buildSelectTaskNav(previous, projectId, taskId));
  };

  const zoomTo = (parentId: string | undefined) => {
    setTaskNav(previous => buildZoomTaskNav(previous, projectId, parentId));
  };

  return {selectedTaskId, zoomParentId, selectTask, zoomTo};
}

/*
 * Helpers.
 */

function resolveActiveTaskNav(
  taskNav: ProjectTaskNav | undefined,
  activeProjectId: string | undefined
): ProjectTaskNav | undefined {
  if (activeProjectId === undefined) {
    return undefined;
  }
  return priorTaskNav(taskNav, activeProjectId);
}

function priorTaskNav(
  previous: ProjectTaskNav | undefined,
  activeProjectId: string
): ProjectTaskNav | undefined {
  return previous?.projectId === activeProjectId ? previous : undefined;
}

function buildSelectTaskNav(
  previous: ProjectTaskNav | undefined,
  activeProjectId: string,
  taskId: string
): ProjectTaskNav {
  const prior = priorTaskNav(previous, activeProjectId);

  return {
    projectId: activeProjectId,
    selectedTaskId: taskId,
    zoomParentId: prior?.zoomParentId
  };
}

function buildZoomTaskNav(
  previous: ProjectTaskNav | undefined,
  activeProjectId: string,
  parentId: string | undefined
): ProjectTaskNav {
  const prior = priorTaskNav(previous, activeProjectId);

  return {
    projectId: activeProjectId,
    selectedTaskId: prior?.selectedTaskId,
    zoomParentId: parentId
  };
}
