import {useCallback} from 'preact/hooks';
import {useShallow} from 'zustand/shallow';

import {TaskDetailQuickPrompts} from '@/components/TaskDetail/QuickPrompts/TaskDetailQuickPrompts';
import * as styles from '@/components/TaskDetail/taskDetail.css';
import * as listStyles from '@/components/TaskList/taskList.css';
import {WorkspaceHomePanel} from '@/components/WorkspaceHomePanel/WorkspaceHomePanel';
import {useClipboardCopy} from '@/hooks/useClipboardCopy';
import {compareTasks, findTaskById, type Task, type TaskStatus, type Tasks, taskStatus} from '@/lib/taskApi';
import type {Workspace, Workspaces} from '@/lib/workspaceApi';
import {useAppStore} from '@/stores/appStore';
import * as disclosureStyles from '@/styles/panelDisclosure.css';

/*
 * Types.
 */

type TaskDetailContentProps = {
  task: Task;
  tasks: Tasks;
  workspace: Workspace | undefined;
  onOpenChildTask: (taskId: string) => void;
};

type TaskDetailHeaderProps = {
  id: string;
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

type TaskDetailNoSelectionProps = {
  workspaces: Workspaces;
  activeWorkspaceId: string | undefined;
};

/*
 * Constants.
 */

/** Description stays expanded at or below these limits; longer copy starts collapsed. */
const LONG_DESCRIPTION_LINE_COUNT = 10;
const LONG_DESCRIPTION_CHAR_COUNT = 500;

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
  const {workspaces, activeWorkspaceId, tasks, selectedTaskId, selectTask, zoomTo} = useTaskDetailState();

  if (selectedTaskId === undefined) {
    return <TaskDetailNoSelection workspaces={workspaces} activeWorkspaceId={activeWorkspaceId} />;
  }

  const task = findTaskById(tasks, selectedTaskId);
  if (task === undefined) {
    return (
      <aside class={styles.panel} aria-label="Task details">
        <p class={styles.panelEmptyMessage}>Task not found.</p>
      </aside>
    );
  }

  const openChildTask = (childId: string) => {
    selectTask(childId);
    zoomTo(task.id);
  };

  const activeWorkspace = workspaces.find(workspace => workspace.id === activeWorkspaceId);

  return (
    <TaskDetailContent
      task={task}
      tasks={tasks}
      workspace={activeWorkspace}
      onOpenChildTask={openChildTask}
    />
  );
}

function TaskDetailNoSelection({workspaces, activeWorkspaceId}: TaskDetailNoSelectionProps) {
  const activeWorkspace = workspaces.find(workspace => workspace.id === activeWorkspaceId);
  if (activeWorkspace !== undefined) {
    return <WorkspaceHomePanel workspace={activeWorkspace} />;
  }

  return (
    <aside class={styles.panel} aria-label="Task details">
      <p class={styles.panelEmptyMessage}>Select a task to view details.</p>
    </aside>
  );
}

function TaskDetailContent({task, tasks, workspace, onOpenChildTask}: TaskDetailContentProps) {
  const status = taskStatus(task);
  const childTasks = resolveChildTasks(tasks, task.children);
  const blockers = resolveBlockers(tasks, task.blockedBy);

  return (
    <aside class={styles.panel} aria-label="Task details">
      <TaskDetailHeader id={task.id} name={task.name} status={status} />
      {workspace !== undefined ? (
        <TaskDetailQuickPrompts
          key={`${workspace.id}:${task.id}`}
          workspace={workspace}
          taskId={task.id}
          status={status}
        />
      ) : undefined}
      <TaskDetailFields task={task} blockers={blockers} />
      <TaskDetailChildTasks childTasks={childTasks} onOpenChildTask={onOpenChildTask} />
    </aside>
  );
}

function TaskDetailHeader({id, name, status}: TaskDetailHeaderProps) {
  const {isCopied, copy} = useClipboardCopy();

  const copyId = useCallback(() => {
    void copy(id);
  }, [copy, id]);

  return (
    <>
      <h2 class={titleClass(status)}>{name}</h2>
      <div class={styles.statusRow}>
        <span class={statusBadgeClass(status)}>
          <span class={taskStatusDotClass(status)} aria-hidden="true" />
          {statusLabel(status)}
        </span>
        <button
          type="button"
          class={[styles.taskIdButton, isCopied ? styles.taskIdCopied : ''].filter(Boolean).join(' ')}
          onClick={copyId}
          title="Copy task ID"
          aria-label={isCopied ? 'Copied!' : `Copy task ID: ${id}`}
        >
          {isCopied ? '✓ Copied!' : id}
        </button>
      </div>
    </>
  );
}

function TaskDetailFields({task, blockers}: TaskDetailFieldsProps) {
  return (
    <>
      {task.description !== undefined ? (
        <details class={disclosureStyles.panelDisclosureDetails} open={!isLongDescription(task.description)}>
          <summary class={disclosureStyles.panelDisclosureSummary}>Description</summary>
          <p class={styles.sectionBody}>{task.description}</p>
        </details>
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

function useTaskDetailState() {
  return useAppStore(
    useShallow(state => ({
      workspaces: state.workspaces,
      activeWorkspaceId: state.activeWorkspaceId,
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

function isLongDescription(description: string): boolean {
  const trimmed = description.trim();
  if (trimmed.length === 0) {
    return false;
  }

  const lineCount = trimmed.split('\n').length;
  return lineCount > LONG_DESCRIPTION_LINE_COUNT || trimmed.length > LONG_DESCRIPTION_CHAR_COUNT;
}
