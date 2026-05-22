import {TaskList} from '@/components/TaskList';
import * as styles from '@/components/taskList.css';
import type {Tasks} from '@/lib/taskApi';

/*
 * Types.
 */

export type TaskBoardProps = {
  tasks: Tasks;
  zoomParentId: string | undefined;
  selectedTaskId: string | undefined;
  onSelectTask: (taskId: string) => void;
  onZoomTask: (taskId: string) => void;
};

/*
 * Component.
 */

export function TaskBoard({tasks, zoomParentId, selectedTaskId, onSelectTask, onZoomTask}: TaskBoardProps) {
  const levelTasks = tasksAtLevel(tasks, zoomParentId);

  return (
    <div class={styles.board}>
      <TaskList
        tasks={levelTasks}
        selectedTaskId={selectedTaskId}
        onSelectTask={onSelectTask}
        onZoomTask={onZoomTask}
      />
    </div>
  );
}

/*
 * Helpers.
 */

function tasksAtLevel(tasks: Tasks, parentId: string | undefined): Tasks {
  if (parentId === undefined) {
    return tasks.filter(task => task.parentId === undefined);
  }
  return tasks.filter(task => task.parentId === parentId);
}
