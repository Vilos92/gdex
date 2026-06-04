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
  const selectedExists = selectedTaskId !== undefined && sortedTasks.some(task => task.id === selectedTaskId);

  if (sortedTasks.length === 0) {
    if (isLoading) {
      return null;
    }
    return <p class={styles.emptyMessage}>No tasks at this level.</p>;
  }

  return (
    <>
      <div class={styles.list} role="listbox" aria-label="Tasks">
        {sortedTasks.map((task, index) => (
          <TaskListItem
            key={task.id}
            task={task}
            isSelected={task.id === selectedTaskId}
            isTabStop={
              task.id === selectedTaskId ||
              (selectedTaskId === undefined && index === 0) ||
              (!selectedExists && index === 0)
            }
            onSelectTask={onSelectTask}
            onContextMenu={onContextMenu}
          />
        ))}
      </div>
      {contextMenu !== undefined
        ? createPortal(
            <TaskAgentPromptMenu
              workspace={workspace}
              task={contextMenu.task}
              position={{x: contextMenu.x, y: contextMenu.y}}
              onClose={contextMenu.onClose}
            />,
            document.body
          )
        : undefined}
    </>
  );
}

/*
 * Helpers.
 */

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
