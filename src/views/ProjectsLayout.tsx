import {AppTopBar} from '@/components/AppTopBar';
import {ProjectSidebar} from '@/components/ProjectSidebar';
import {useProjectTaskNav} from '@/hooks/useProjectTaskNav';
import {useProjectTasks} from '@/hooks/useProjectTasks';
import type {Projects} from '@/lib/projectApi';
import {ProjectMain} from '@/views/ProjectMain';
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
  const {tasks, isLoading, loadErrorMessage} = useProjectTasks(activeProjectId);
  const {selectedTaskId, zoomParentId, selectTask, zoomTo} = useProjectTaskNav(activeProjectId);

  const activeProject = projects.find(project => project.id === activeProjectId);

  return (
    <div class={styles.appFrame}>
      <AppTopBar
        projectName={activeProject?.name}
        tasks={tasks}
        zoomParentId={zoomParentId}
        onZoomTo={zoomTo}
      />
      <div class={styles.shell}>
        <ProjectSidebar
          projects={projects}
          activeProjectId={activeProjectId}
          onProjectsChange={onProjectsChange}
        />
        <main class={styles.main}>
          <ProjectMain
            activeProject={activeProject}
            tasks={tasks}
            isLoading={isLoading}
            loadErrorMessage={loadErrorMessage}
            zoomParentId={zoomParentId}
            selectedTaskId={selectedTaskId}
            onSelectTask={selectTask}
            onZoomTask={zoomTo}
          />
        </main>
      </div>
    </div>
  );
}
