import {useState} from 'preact/hooks';
import {useShallow} from 'zustand/shallow';

import {AddProjectPanel} from '@/components/AddProjectPanel';
import {ProjectList} from '@/components/ProjectList';
import * as styles from '@/components/projectSidebar.css';
import {invokeErrorMessage} from '@/lib/error';
import {setActiveProject} from '@/lib/projectApi';
import {useAppStore} from '@/stores/appStore';

/*
 * Component.
 */

export function ProjectSidebar() {
  const [selectError, setSelectError] = useState<string | undefined>(undefined);
  const {projects, activeProjectId, setActiveProjectId} = useProjectSidebarState();

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

  return (
    <aside class={styles.sidebar}>
      <h1 class={styles.title}>gdex</h1>
      {selectError !== undefined ? (
        <p class={styles.selectError} role="alert">
          {selectError}
        </p>
      ) : undefined}
      <ProjectList projects={projects} activeProjectId={activeProjectId} onSelect={selectProject} />
      <AddProjectPanel />
    </aside>
  );
}

/*
 * Hooks.
 */

function useProjectSidebarState() {
  return useAppStore(
    useShallow(state => ({
      projects: state.projects,
      activeProjectId: state.activeProjectId,
      setActiveProjectId: state.setActiveProjectId
    }))
  );
}
