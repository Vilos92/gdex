import {createPortal} from 'preact/compat';

import {TaskAgentPromptMenu} from '@/components/TaskAgentPromptMenu/TaskAgentPromptMenu';
import * as styles from '@/components/TaskList/taskList.css';
import {compareTasks, type Task, type TaskStatus, type Tasks, taskStatus} from '@/lib/taskApi';
import type {Workspace} from '@/lib/workspaceApi';

/*
 * Types.
 */

export type TaskListProps = {
  tasks: Tasks;
  workspace: Workspace;
  selectedTaskId: string | undefined;
  isLoading: boolean;
  onSelectTask: (taskId: string) => void;
  onContextMenu: (task: Task, position: {x: number; y: number}) => void;
  contextMenu:
    | {
        task: Task;
        x: number;
        y: number;
        onClose: () => void;
      }
    | undefined;
};

type TaskListItemProps = {
  task: Task;
  isSelected: boolean;
  isTabStop: boolean;
  onSelectTask: (taskId: string) => void;
  onContextMenu: (task: Task, position: {x: number; y: number}) => void;
};

/*
 * Styles.
 */

function taskRowButtonClass(isSelected: boolean): string {
  return [styles.taskButton, isSelected ? styles.taskButtonSelected : ''].filter(Boolean).join(' ');
}

function taskNameClass(status: TaskStatus): string {
  return [styles.taskName, status === 'done' ? styles.taskNameDone : ''].filter(Boolean).join(' ');
}

function statusDotVariantClass(status: TaskStatus): string {
  switch (status) {
    case 'in_progress':
      return styles.statusInProgress;
    case 'done':
      return styles.statusDone;
    default:
      return styles.statusPending;
  }
}

function taskStatusDotClass(status: TaskStatus): string {
  return [styles.statusDot, statusDotVariantClass(status)].join(' ');
}

/*
 * Component.
 */

function TaskListItem({task, isSelected, isTabStop, onSelectTask, onContextMenu}: TaskListItemProps) {
  const status = taskStatus(task);

  const handleContextMenu = (event: MouseEvent) => {
    event.preventDefault();
    onContextMenu(task, {x: event.clientX, y: event.clientY});
  };

  return (
    <button
      type="button"
      class={taskRowButtonClass(isSelected)}
      data-task-id={task.id}
      role="option"
      tabIndex={isTabStop ? 0 : -1}
      aria-selected={isSelected ? 'true' : 'false'}
      onClick={() => onSelectTask(task.id)}
      onContextMenu={handleContextMenu}
    >
      <span class={taskStatusDotClass(status)} title={statusLabel(status)} />
      <span class={taskNameClass(status)}>{task.name}</span>
    </button>
  );
}

export function TaskList({
  tasks,
  workspace,
  selectedTaskId,
  isLoading,
  onSelectTask,
  onContextMenu,
  contextMenu
}: TaskListProps) {
  const sortedTasks = [...tasks].sort(compareTasks);

  if (sortedTasks.length === 0) {
    return renderEmptyTaskList(isLoading);
  }

  const selectedExists = checkSelectedTaskExists(sortedTasks, selectedTaskId);

  return (
    <>
      <div class={styles.list} role="listbox" aria-label="Tasks">
        {sortedTasks.map((task, index) => (
          <TaskListItem
            key={task.id}
            task={task}
            isSelected={task.id === selectedTaskId}
            isTabStop={checkIsTaskTabStop(task.id, index, selectedTaskId, selectedExists)}
            onSelectTask={onSelectTask}
            onContextMenu={onContextMenu}
          />
        ))}
      </div>
      {renderTaskListContextMenu(workspace, contextMenu)}
    </>
  );
}

/*
 * Helpers.
 */

function renderEmptyTaskList(isLoading: boolean) {
  if (isLoading) {
    return null;
  }

  return <p class={styles.emptyMessage}>No tasks at this level.</p>;
}

function checkSelectedTaskExists(sortedTasks: Tasks, selectedTaskId: string | undefined): boolean {
  return selectedTaskId !== undefined && sortedTasks.some(task => task.id === selectedTaskId);
}

function checkIsTaskTabStop(
  taskId: string,
  index: number,
  selectedTaskId: string | undefined,
  selectedExists: boolean
): boolean {
  if (taskId === selectedTaskId) {
    return true;
  }

  if (index !== 0) {
    return false;
  }

  return selectedTaskId === undefined || !selectedExists;
}

function renderTaskListContextMenu(workspace: Workspace, contextMenu: TaskListProps['contextMenu']) {
  if (contextMenu === undefined) {
    return undefined;
  }

  return createPortal(
    <TaskAgentPromptMenu
      workspace={workspace}
      task={contextMenu.task}
      position={{x: contextMenu.x, y: contextMenu.y}}
      onClose={contextMenu.onClose}
    />,
    document.body
  );
}

function statusLabel(status: TaskStatus): string {
  switch (status) {
    case 'in_progress':
      return 'In progress';
    case 'done':
      return 'Done';
    default:
      return 'Pending';
  }
}
