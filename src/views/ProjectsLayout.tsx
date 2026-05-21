import {ProjectSidebar} from '@/components/ProjectSidebar';
import type {Projects} from '@/lib/projectApi';
import * as styles from '@/views/views.css';

/*
 * Types.
 */

export type ProjectsLayoutProps = {
  projects: Projects;
  activeProjectId: string | undefined;
  onProjectsChange: (projects: Projects, activeProjectId: string | undefined) => void;
};

/*
 * Component.
 */

export function ProjectsLayout({projects, activeProjectId, onProjectsChange}: ProjectsLayoutProps) {
  const activeProject = projects.find(project => project.id === activeProjectId);

  return (
    <div class={styles.shell}>
      <ProjectSidebar
        projects={projects}
        activeProjectId={activeProjectId}
        onProjectsChange={onProjectsChange}
      />
      <main class={styles.main}>
        <p class={styles.placeholder}>
          {activeProject !== undefined ? `Project selected: ${activeProject.name}` : 'Select a project'}
        </p>
      </main>
    </div>
  );
}
