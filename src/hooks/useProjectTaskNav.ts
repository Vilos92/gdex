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

  const activeTaskNav = taskNav?.projectId === activeProjectId ? taskNav : undefined;
  const selectedTaskId = activeTaskNav?.selectedTaskId;
  const zoomParentId = activeTaskNav?.zoomParentId;

  const selectTask = (taskId: string) => {
    if (activeProjectId === undefined) {
      return;
    }
    setTaskNav(previous => ({
      projectId: activeProjectId,
      selectedTaskId: taskId,
      zoomParentId: previous?.projectId === activeProjectId ? previous.zoomParentId : undefined
    }));
  };

  const zoomTo = (parentId: string | undefined) => {
    if (activeProjectId === undefined) {
      return;
    }
    setTaskNav(previous => ({
      projectId: activeProjectId,
      selectedTaskId: previous?.projectId === activeProjectId ? previous.selectedTaskId : undefined,
      zoomParentId: parentId
    }));
  };

  return {selectedTaskId, zoomParentId, selectTask, zoomTo};
}
