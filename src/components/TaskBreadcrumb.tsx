import {Fragment} from 'preact';

import * as styles from '@/components/appTopBar.css';
import type {Task, Tasks} from '@/lib/taskApi';

/*
 * Types.
 */

type BreadcrumbSegment = {
  id: string;
  name: string;
};

export type TaskBreadcrumbProps = {
  workspaceName: string | undefined;
  tasks: Tasks;
  zoomParentId: string | undefined;
  selectedTaskId: string | undefined;
  onNavigateTo: (taskId: string | undefined) => void;
};

type BreadcrumbLinkProps = {
  label: string;
  onNavigate: () => void;
};

type AncestorWalkState = {
  chain: readonly string[];
  visited: ReadonlySet<string>;
  currentId: string | undefined;
  stopped: boolean;
};

/*
 * Component.
 */

function BreadcrumbLink({label, onNavigate}: BreadcrumbLinkProps) {
  return (
    <button type="button" class={styles.breadcrumbSegment} onClick={onNavigate}>
      {label}
    </button>
  );
}

export function TaskBreadcrumb({
  workspaceName,
  tasks,
  zoomParentId,
  selectedTaskId,
  onNavigateTo
}: TaskBreadcrumbProps) {
  if (workspaceName === undefined) {
    return (
      <nav class={styles.breadcrumb} aria-label="Location">
        <span class={styles.appTitle}>gdex</span>
      </nav>
    );
  }

  const segments = breadcrumbSegments(tasks, zoomParentId, selectedTaskId);

  if (segments.length === 0) {
    return (
      <nav class={styles.breadcrumb} aria-label="Task level">
        <span class={styles.breadcrumbCurrent}>{workspaceName}</span>
      </nav>
    );
  }

  return (
    <nav class={styles.breadcrumb} aria-label="Task level">
      <BreadcrumbLink label={workspaceName} onNavigate={() => onNavigateTo(undefined)} />
      {segments.map((segment, index) => {
        const isCurrent = index === segments.length - 1;

        return (
          <Fragment key={segment.id}>
            <span class={styles.breadcrumbSeparator} aria-hidden="true">
              /
            </span>
            {isCurrent ? (
              <span class={styles.breadcrumbCurrent}>{segment.name}</span>
            ) : (
              <BreadcrumbLink label={segment.name} onNavigate={() => onNavigateTo(segment.id)} />
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}

/*
 * Helpers.
 */

function taskByIdMap(tasks: Tasks): Map<string, Task> {
  return new Map(tasks.map(task => [task.id, task]));
}

/** Walk `parentId` from `startId` to the root. Returns ids root-first; stops on cycles or missing links. */
function collectAncestorIds(tasks: Tasks, startId: string): readonly string[] {
  return collectAncestorIdsFromMap(taskByIdMap(tasks), startId);
}

function collectAncestorIdsFromMap(byId: Map<string, Task>, startId: string): readonly string[] {
  const initial: AncestorWalkState = {
    chain: [],
    visited: new Set(),
    currentId: startId,
    stopped: false
  };

  const maxSteps = byId.size + 1;
  const {chain} = Array.from({length: maxSteps}).reduce<AncestorWalkState>(
    state => stepAncestorWalk(byId, state),
    initial
  );

  return chain;
}

function checkIsAncestorWalkFinished(state: AncestorWalkState): boolean {
  if (state.stopped) {
    return true;
  }
  const {currentId} = state;
  return currentId === undefined || state.visited.has(currentId);
}

function stepAncestorWalk(byId: Map<string, Task>, state: AncestorWalkState): AncestorWalkState {
  if (checkIsAncestorWalkFinished(state)) {
    return {...state, stopped: true};
  }

  const currentId = state.currentId as string;

  return {
    chain: [currentId, ...state.chain],
    visited: new Set([...state.visited, currentId]),
    currentId: byId.get(currentId)?.parentId,
    stopped: false
  };
}

/** Resolve a task id to a breadcrumb segment (falls back to the raw id when the task is missing). */
function toBreadcrumbSegment(byId: Map<string, Task>, id: string): BreadcrumbSegment {
  const task = byId.get(id);
  if (task === undefined) {
    return {id, name: id};
  }
  return {id: task.id, name: task.name};
}

/** Trail for the list zoom level, plus the selected row when it is visible in that list. */
function breadcrumbSegments(
  tasks: Tasks,
  zoomParentId: string | undefined,
  selectedTaskId: string | undefined
): readonly BreadcrumbSegment[] {
  const byId = taskByIdMap(tasks);
  const zoomTrail =
    zoomParentId === undefined
      ? []
      : collectAncestorIds(tasks, zoomParentId).map(id => toBreadcrumbSegment(byId, id));

  if (selectedTaskId === undefined) {
    return zoomTrail;
  }

  const selected = byId.get(selectedTaskId);
  if (selected === undefined || !isTaskInZoomList(selected, zoomParentId)) {
    return zoomTrail;
  }

  if (selected.id === zoomParentId) {
    return zoomTrail;
  }

  return [...zoomTrail, toBreadcrumbSegment(byId, selected.id)];
}

function isTaskInZoomList(task: Task, zoomParentId: string | undefined): boolean {
  return task.parentId === zoomParentId;
}
