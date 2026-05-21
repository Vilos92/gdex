import {useState} from 'preact/hooks';

import {AddProjectPanel} from '@/components/AddProjectPanel';
import {ProjectList} from '@/components/ProjectList';
import * as styles from '@/components/projectSidebar.css';
import {invokeErrorMessage} from '@/lib/error';
import {type Projects, setActiveProject} from '@/lib/projectApi';

/*
 * Types.
 */

export type ProjectSidebarProps = {
  projects: Projects;
  activeProjectId: string | undefined;
  onProjectsChange: (projects: Projects, activeProjectId: string | undefined) => void;
};

/*
 * Component.
 */

export function ProjectSidebar({projects, activeProjectId, onProjectsChange}: ProjectSidebarProps) {
  const [selectError, setSelectError] = useState<string | undefined>(undefined);

  const selectProject = async (projectId: string) => {
    if (projectId === activeProjectId) {
      return;
    }
    setSelectError(undefined);
    try {
      await setActiveProject(projectId);
      onProjectsChange(projects, projectId);
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
      <AddProjectPanel
        projects={projects}
        activeProjectId={activeProjectId}
        onProjectsChange={onProjectsChange}
      />
    </aside>
  );
}
