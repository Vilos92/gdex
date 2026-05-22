import {useShallow} from 'zustand/shallow';

import {TaskBoard} from '@/components/TaskBoard';
import * as taskStyles from '@/components/taskList.css';
import {useAppStore} from '@/stores/appStore';
import * as styles from '@/views/views.css';

/*
 * Component.
 */

export function ProjectMain() {
  const {
    projects,
    activeProjectId,
    tasks,
    isLoading,
    loadErrorMessage,
    zoomParentId,
    selectedTaskId,
    selectTask,
    zoomTo
  } = useProjectMainState();

  const activeProject = projects.find(project => project.id === activeProjectId);

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
      onSelectTask={selectTask}
      onZoomTask={zoomTo}
    />
  );
}

/*
 * Hooks.
 */

function useProjectMainState() {
  return useAppStore(
    useShallow(state => ({
      projects: state.projects,
      activeProjectId: state.activeProjectId,
      tasks: state.tasks,
      isLoading: state.isTasksLoading,
      loadErrorMessage: state.tasksLoadError,
      zoomParentId: state.zoomParentId,
      selectedTaskId: state.selectedTaskId,
      selectTask: state.selectTask,
      zoomTo: state.zoomTo
    }))
  );
}
