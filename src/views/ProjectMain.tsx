import {TaskBoard} from '@/components/TaskBoard';
import * as taskStyles from '@/components/taskList.css';
import type {Project} from '@/lib/projectApi';
import type {Tasks} from '@/lib/taskApi';
import * as styles from '@/views/views.css';

/*
 * Types.
 */

export type ProjectMainProps = {
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

export function ProjectMain({
  activeProject,
  tasks,
  isLoading,
  loadErrorMessage,
  zoomParentId,
  selectedTaskId,
  onSelectTask,
  onZoomTask
}: ProjectMainProps) {
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
