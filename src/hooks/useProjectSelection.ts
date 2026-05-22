import {useState} from 'preact/hooks';
import {useShallow} from 'zustand/shallow';

import {invokeErrorMessage} from '@/lib/error';
import {setActiveProject} from '@/lib/projectApi';
import {useAppStore} from '@/stores/appStore';

/*
 * Hooks.
 */

export function useProjectSelection() {
  const [selectError, setSelectError] = useState<string | undefined>(undefined);
  const {projects, activeProjectId, setActiveProjectId} = useAppStore(
    useShallow(state => ({
      projects: state.projects,
      activeProjectId: state.activeProjectId,
      setActiveProjectId: state.setActiveProjectId
    }))
  );

  const selectProject = async (projectId: string) => {
    setSelectError(undefined);
    if (projectId === activeProjectId) {
      return;
    }
    try {
      await setActiveProject(projectId);
      setActiveProjectId(projectId);
    } catch (error) {
      console.error('set_active_project failed', error);
      setSelectError(invokeErrorMessage(error, 'Could not set active project.'));
    }
  };

  return {projects, activeProjectId, selectError, selectProject};
}
