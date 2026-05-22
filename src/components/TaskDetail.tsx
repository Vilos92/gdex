import {useShallow} from 'zustand/shallow';

import * as styles from '@/components/taskDetail.css';
import * as listStyles from '@/components/taskList.css';
import {compareTasks, type Task, type TaskStatus, type Tasks, taskStatus} from '@/lib/taskApi';
import {useAppStore} from '@/stores/appStore';

/*
 * Types.
 */

type TaskDetailContentProps = {
  task: Task;
  tasks: Tasks;
  onOpenChildTask: (taskId: string) => void;
};

type TaskDetailHeaderProps = {
  name: string;
  status: TaskStatus;
};

type TaskDetailFieldsProps = {
  task: Task;
  blockers: BlockerEntry[];
};

type TaskDetailChildTasksProps = {
  childTasks: Task[];
  onOpenChildTask: (taskId: string) => void;
};

type ChildTaskItemProps = {
  task: Task;
  onOpenChildTask: (taskId: string) => void;
};

type BlockerEntry = {id: string; name: string};

/*
 * Styles.
 */

function titleClass(status: TaskStatus): string {
  return [styles.title, status === 'done' ? styles.titleDone : ''].filter(Boolean).join(' ');
}

function statusBadgeVariantClass(status: TaskStatus): string {
  switch (status) {
    case 'in_progress':
      return styles.statusBadgeInProgress;
    case 'done':
      return styles.statusBadgeDone;
    default:
      return styles.statusBadgePending;
  }
}

function statusBadgeClass(status: TaskStatus): string {
  return [styles.statusBadge, statusBadgeVariantClass(status)].join(' ');
}

function statusDotVariantClass(status: TaskStatus): string {
  switch (status) {
    case 'in_progress':
      return listStyles.statusInProgress;
    case 'done':
      return listStyles.statusDone;
    default:
      return listStyles.statusPending;
  }
}

function taskStatusDotClass(status: TaskStatus): string {
  return [listStyles.statusDot, statusDotVariantClass(status)].join(' ');
}

function childTaskNameClass(status: TaskStatus): string {
  return [styles.childTaskName, status === 'done' ? styles.childTaskNameDone : ''].filter(Boolean).join(' ');
}

/*
 * Component.
 */

export function TaskDetail() {
  const {tasks, selectedTaskId, selectTask, zoomTo} = useTaskDetailState();

  if (selectedTaskId === undefined) {
    return (
      <aside class={styles.panel} aria-label="Task details">
        <p class={styles.emptyMessage}>Select a task to view details.</p>
      </aside>
    );
  }

  const task = findTaskById(tasks, selectedTaskId);
  if (task === undefined) {
    return (
      <aside class={styles.panel} aria-label="Task details">
        <p class={styles.emptyMessage}>Task not found.</p>
      </aside>
    );
  }

  const openChildTask = (childId: string) => {
    selectTask(childId);
    zoomTo(task.id);
  };

  return <TaskDetailContent task={task} tasks={tasks} onOpenChildTask={openChildTask} />;
}

function TaskDetailContent({task, tasks, onOpenChildTask}: TaskDetailContentProps) {
  const status = taskStatus(task);
  const childTasks = resolveChildTasks(tasks, task.children);
  const blockers = resolveBlockers(tasks, task.blockedBy);

  return (
    <aside class={styles.panel} aria-label="Task details">
      <TaskDetailHeader name={task.name} status={status} />
      <TaskDetailFields task={task} blockers={blockers} />
      <TaskDetailChildTasks childTasks={childTasks} onOpenChildTask={onOpenChildTask} />
    </aside>
  );
}

function TaskDetailHeader({name, status}: TaskDetailHeaderProps) {
  return (
    <>
      <h2 class={titleClass(status)}>{name}</h2>
      <div class={styles.statusRow}>
        <span class={statusBadgeClass(status)}>
          <span class={taskStatusDotClass(status)} aria-hidden="true" />
          {statusLabel(status)}
        </span>
      </div>
    </>
  );
}

function TaskDetailFields({task, blockers}: TaskDetailFieldsProps) {
  return (
    <>
      {task.description !== undefined ? (
        <section class={styles.section}>
          <h3 class={styles.sectionLabel}>Description</h3>
          <p class={styles.sectionBody}>{task.description}</p>
        </section>
      ) : undefined}

      {task.result !== undefined ? (
        <section class={styles.section}>
          <h3 class={styles.sectionLabel}>Result</h3>
          <p class={styles.sectionBody}>{task.result}</p>
        </section>
      ) : undefined}

      {blockers.length > 0 ? (
        <section class={styles.section}>
          <h3 class={styles.sectionLabel}>Blocked by</h3>
          <ul class={styles.blockedList}>
            {blockers.map(blocker => (
              <li key={blocker.id}>{blocker.name}</li>
            ))}
          </ul>
        </section>
      ) : undefined}
    </>
  );
}

function TaskDetailChildTasks({childTasks, onOpenChildTask}: TaskDetailChildTasksProps) {
  if (childTasks.length === 0) {
    return undefined;
  }

  return (
    <section class={styles.childTasksSection} aria-label="Tasks">
      <h3 class={styles.sectionLabel}>Tasks</h3>
      <ul class={styles.childTasksList}>
        {childTasks.map(child => (
          <ChildTaskItem key={child.id} task={child} onOpenChildTask={onOpenChildTask} />
        ))}
      </ul>
    </section>
  );
}

function ChildTaskItem({task, onOpenChildTask}: ChildTaskItemProps) {
  const status = taskStatus(task);

  return (
    <li>
      <button type="button" class={styles.childTaskButton} onClick={() => onOpenChildTask(task.id)}>
        <span class={taskStatusDotClass(status)} title={statusLabel(status)} />
        <span class={childTaskNameClass(status)}>{task.name}</span>
      </button>
    </li>
  );
}

/*
 * Hooks.
 */

function useTaskDetailState() {
  return useAppStore(
    useShallow(state => ({
      tasks: state.tasks,
      selectedTaskId: state.selectedTaskId,
      selectTask: state.selectTask,
      zoomTo: state.zoomTo
    }))
  );
}

/*
 * Helpers.
 */

function findTaskById(tasks: Tasks, taskId: string): Task | undefined {
  return tasks.find(task => task.id === taskId);
}

function resolveChildTasks(tasks: Tasks, childIds: readonly string[]): Task[] {
  const byId = new Map(tasks.map(task => [task.id, task]));
  const children: Task[] = [];
  for (const childId of childIds) {
    const child = byId.get(childId);
    if (child !== undefined) {
      children.push(child);
    }
  }
  return children.sort(compareTasks);
}

function resolveBlockers(tasks: Tasks, blockerIds: readonly string[]): BlockerEntry[] {
  const byId = new Map(tasks.map(task => [task.id, task]));
  const blockers: BlockerEntry[] = [];
  for (const blockerId of blockerIds) {
    const blocker = byId.get(blockerId);
    blockers.push({id: blockerId, name: blocker?.name ?? blockerId});
  }
  return blockers;
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
