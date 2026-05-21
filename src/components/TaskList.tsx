import * as styles from '@/components/taskList.css';
import {type Task, type Tasks, taskStatus} from '@/lib/taskApi';

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
 * Component.
 */

function TaskListItem({task, isSelected, onSelectTask, onZoomTask}: TaskListItemProps) {
  const status = taskStatus(task);
  const hasChildren = task.children.length > 0;

  return (
    <li>
      <button
        type="button"
        class={[styles.taskButton, isSelected ? styles.taskButtonSelected : ''].filter(Boolean).join(' ')}
        aria-current={isSelected ? 'true' : undefined}
        title={hasChildren ? 'Open subtasks' : undefined}
        onClick={() => {
          onSelectTask(task.id);
          if (hasChildren) {
            onZoomTask(task.id);
          }
        }}
      >
        <span class={[styles.statusDot, statusDotClass(status)].join(' ')} title={statusLabel(status)} />
        <span
          class={[styles.taskName, status === 'done' ? styles.taskNameDone : ''].filter(Boolean).join(' ')}
        >
          {task.name}
        </span>
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

function compareTasks(left: Task, right: Task): number {
  if (right.priority !== left.priority) {
    return right.priority - left.priority;
  }
  return left.name.localeCompare(right.name);
}

function statusDotClass(status: ReturnType<typeof taskStatus>): string {
  switch (status) {
    case 'in_progress':
      return styles.statusInProgress;
    case 'done':
      return styles.statusDone;
    default:
      return styles.statusPending;
  }
}

function statusLabel(status: ReturnType<typeof taskStatus>): string {
  switch (status) {
    case 'in_progress':
      return 'In progress';
    case 'done':
      return 'Done';
    default:
      return 'Pending';
  }
}
