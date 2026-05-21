import {AddProjectPanel} from '@/app/components/AddProjectPanel';
import {ProjectList} from '@/app/components/ProjectList';
import * as styles from '@/app/components/projectSidebar.css';
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
  async function selectProject(projectId: string) {
    if (projectId === activeProjectId) {
      return;
    }
    try {
      await setActiveProject(projectId);
      onProjectsChange(projects, projectId);
    } catch (error) {
      console.error('set_active_project failed', error);
    }
  }

  return (
    <aside class={styles.sidebar}>
      <h1 class={styles.title}>gdex</h1>
      <ProjectList projects={projects} activeProjectId={activeProjectId} onSelect={selectProject} />
      <AddProjectPanel
        projects={projects}
        activeProjectId={activeProjectId}
        onProjectsChange={onProjectsChange}
      />
    </aside>
  );
}
