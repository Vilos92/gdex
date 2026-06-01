import * as paneStyles from '@/components/TaskBoard/taskBoard.css';
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
  isLoading: boolean;
  onSelectTask: (taskId: string) => void;
};

/*
 * Component.
 */

export function TaskBoard({
  tasks,
  workspace,
  zoomParentId,
  selectedTaskId,
  isLoading,
  onSelectTask
}: TaskBoardProps) {
  const levelTasks = tasksAtLevel(tasks, zoomParentId);

  return (
    <div id="task-board" class={paneStyles.pane}>
      <div class={styles.board}>
        <TaskList
          tasks={levelTasks}
          workspace={workspace}
          selectedTaskId={selectedTaskId}
          isLoading={isLoading}
          onSelectTask={onSelectTask}
        />
      </div>
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
