import * as styles from '@/components/taskList.css';
import {type Task, type TaskStatus, type Tasks, taskStatus} from '@/lib/taskApi';

/*
 * Types.
 */

export type TaskListProps = {
  tasks: Tasks;
  selectedTaskId: string | undefined;
  onSelectTask: (taskId: string) => void;
  onZoomTask: (taskId: string) => void;
};

type TaskListItemProps = {
  task: Task;
  isSelected: boolean;
  onSelectTask: (taskId: string) => void;
  onZoomTask: (taskId: string) => void;
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

function TaskListItem({task, isSelected, onSelectTask, onZoomTask}: TaskListItemProps) {
  const status = taskStatus(task);
  const hasChildren = task.children.length > 0;

  return (
    <li>
      <button
        type="button"
        class={taskRowButtonClass(isSelected)}
        aria-current={isSelected ? 'true' : undefined}
        title={hasChildren ? 'Open subtasks' : undefined}
        onClick={() => activateTask(task.id, hasChildren, onSelectTask, onZoomTask)}
      >
        <span class={taskStatusDotClass(status)} title={statusLabel(status)} />
        <span class={taskNameClass(status)}>{task.name}</span>
      </button>
    </li>
  );
}

export function TaskList({tasks, selectedTaskId, onSelectTask, onZoomTask}: TaskListProps) {
  const sortedTasks = [...tasks].sort(compareTasks);

  if (sortedTasks.length === 0) {
    return <p class={styles.emptyMessage}>No tasks at this level.</p>;
  }

  return (
    <ul class={styles.list}>
      {sortedTasks.map(task => (
        <TaskListItem
          key={task.id}
          task={task}
          isSelected={task.id === selectedTaskId}
          onSelectTask={onSelectTask}
          onZoomTask={onZoomTask}
        />
      ))}
    </ul>
  );
}

/*
 * Helpers.
 */

function activateTask(
  taskId: string,
  hasChildren: boolean,
  onSelectTask: (taskId: string) => void,
  onZoomTask: (taskId: string) => void
): void {
  onSelectTask(taskId);
  if (hasChildren) {
    onZoomTask(taskId);
  }
}

function compareTasks(left: Task, right: Task): number {
  if (right.priority !== left.priority) {
    return right.priority - left.priority;
  }
  return left.name.localeCompare(right.name);
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
