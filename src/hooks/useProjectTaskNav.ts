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

  const selectTask = (taskId: string) => {
    if (activeProjectId === undefined) {
      return;
    }
    setTaskNav(previous => {
      const prior = priorTaskNav(previous, activeProjectId);
      return {
        projectId: activeProjectId,
        selectedTaskId: taskId,
        zoomParentId: prior?.zoomParentId
      };
    });
  };

  const zoomTo = (parentId: string | undefined) => {
    if (activeProjectId === undefined) {
      return;
    }
    setTaskNav(previous => {
      const prior = priorTaskNav(previous, activeProjectId);
      return {
        projectId: activeProjectId,
        selectedTaskId: prior?.selectedTaskId,
        zoomParentId: parentId
      };
    });
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
