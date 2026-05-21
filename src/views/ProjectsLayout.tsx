import type {ComponentChildren} from 'preact';
import {useState} from 'preact/hooks';

import {AppTopBar} from '@/components/AppTopBar';
import {ProjectSidebar} from '@/components/ProjectSidebar';
import {TaskBoard} from '@/components/TaskBoard';
import * as taskStyles from '@/components/taskList.css';
import {useProjectTasks} from '@/hooks/useProjectTasks';
import type {Project, Projects} from '@/lib/projectApi';
import type {Tasks} from '@/lib/taskApi';
import * as styles from '@/views/views.css';

/*
 * Types.
 */

export type ProjectsLayoutProps = {
  projects: Projects;
  activeProjectId: string | undefined;
  onProjectsChange: (projects: Projects, activeProjectId: string | undefined) => void;
};

type ProjectTaskNav = {
  projectId: string;
  selectedTaskId: string | undefined;
  zoomParentId: string | undefined;
};

type ProjectMainProps = {
  activeProject: Project | undefined;
  tasks: Tasks;
  isLoading: boolean;
  loadErrorMessage: string | undefined;
  zoomParentId: string | undefined;
  selectedTaskId: string | undefined;
  onSelectTask: (taskId: string) => void;
  onZoomTask: (taskId: string) => void;
};

/*
 * Component.
 */

export function ProjectsLayout({projects, activeProjectId, onProjectsChange}: ProjectsLayoutProps) {
  const [taskNav, setTaskNav] = useState<ProjectTaskNav | undefined>(undefined);
  const {tasks, isLoading, loadErrorMessage} = useProjectTasks(activeProjectId);

  const activeTaskNav = taskNav?.projectId === activeProjectId ? taskNav : undefined;
  const selectedTaskId = activeTaskNav?.selectedTaskId;
  const zoomParentId = activeTaskNav?.zoomParentId;

  const activeProject = projects.find(project => project.id === activeProjectId);

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
          {renderProjectMain({
            activeProject,
            tasks,
            isLoading,
            loadErrorMessage,
            zoomParentId,
            selectedTaskId,
            onSelectTask: selectTask,
            onZoomTask: zoomTo
          })}
        </main>
      </div>
    </div>
  );
}

/*
 * Helpers.
 */

function renderProjectMain({
  activeProject,
  tasks,
  isLoading,
  loadErrorMessage,
  zoomParentId,
  selectedTaskId,
  onSelectTask,
  onZoomTask
}: ProjectMainProps): ComponentChildren {
  if (activeProject === undefined) {
    return <p class={styles.placeholder}>Select a project</p>;
  }

  if (isLoading) {
    return <p class={taskStyles.emptyMessage}>Loading tasks…</p>;
  }

  if (loadErrorMessage !== undefined) {
    return (
      <p class={taskStyles.taskLoadError} role="alert">
        {loadErrorMessage}
      </p>
    );
  }

  return (
    <TaskBoard
      tasks={tasks}
      zoomParentId={zoomParentId}
      selectedTaskId={selectedTaskId}
      onSelectTask={onSelectTask}
      onZoomTask={onZoomTask}
    />
  );
}
