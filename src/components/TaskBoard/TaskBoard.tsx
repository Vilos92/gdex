import {useState} from 'preact/hooks';

import * as paneStyles from '@/components/TaskBoard/taskBoard.css';
import {TaskList} from '@/components/TaskList/TaskList';
import * as styles from '@/components/TaskList/taskList.css';
import type {Task, Tasks} from '@/lib/taskApi';
import {tasksAtLevel} from '@/lib/taskLevel';
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

type TaskContextMenuState = {
  task: Task;
  x: number;
  y: number;
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
  const [contextMenu, setContextMenu] = useState<TaskContextMenuState | undefined>(undefined);

  return (
    <div id="task-board" class={paneStyles.pane}>
      <div class={styles.board}>
        <TaskList
          tasks={levelTasks}
          workspace={workspace}
          selectedTaskId={selectedTaskId}
          isLoading={isLoading}
          onSelectTask={onSelectTask}
          onContextMenu={(targetTask, position) => setContextMenu({task: targetTask, ...position})}
          contextMenu={contextMenu && {...contextMenu, onClose: () => setContextMenu(undefined)}}
        />
      </div>
    </div>
  );
}
