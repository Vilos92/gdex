import {TaskList} from '@/components/TaskList/TaskList';
import * as styles from '@/components/TaskList/taskList.css';
import type {Tasks} from '@/lib/taskApi';
import type {Workspace} from '@/lib/workspaceApi';

/*
 * Types.
 */

export type TaskBoardProps = {
  tasks: Tasks;
  workspace: Workspace;
  zoomParentId: string | undefined;
  selectedTaskId: string | undefined;
  onSelectTask: (taskId: string) => void;
};

/*
 * Component.
 */

export function TaskBoard({tasks, workspace, zoomParentId, selectedTaskId, onSelectTask}: TaskBoardProps) {
  const levelTasks = tasksAtLevel(tasks, zoomParentId);

  return (
    <div class={styles.board}>
      <TaskList
        tasks={levelTasks}
        workspace={workspace}
        selectedTaskId={selectedTaskId}
        onSelectTask={onSelectTask}
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
