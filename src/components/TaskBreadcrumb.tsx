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
  projectName: string | undefined;
  tasks: Tasks;
  zoomParentId: string | undefined;
  onZoomTo: (taskId: string | undefined) => void;
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

export function TaskBreadcrumb({projectName, tasks, zoomParentId, onZoomTo}: TaskBreadcrumbProps) {
  if (projectName === undefined) {
    return (
      <nav class={styles.breadcrumb} aria-label="Location">
        <span class={styles.appTitle}>gdex</span>
      </nav>
    );
  }

  if (zoomParentId === undefined) {
    return (
      <nav class={styles.breadcrumb} aria-label="Task level">
        <span class={styles.breadcrumbCurrent}>{projectName}</span>
      </nav>
    );
  }

  const trail = zoomBreadcrumbTrail(tasks, zoomParentId);

  return (
    <nav class={styles.breadcrumb} aria-label="Task level">
      <BreadcrumbLink label={projectName} onNavigate={() => onZoomTo(undefined)} />
      {trail.map((segment, index) => {
        const isCurrent = index === trail.length - 1;

        return (
          <Fragment key={segment.id}>
            <span class={styles.breadcrumbSeparator} aria-hidden="true">
              /
            </span>
            {isCurrent ? (
              <span class={styles.breadcrumbCurrent}>{segment.name}</span>
            ) : (
              <BreadcrumbLink label={segment.name} onNavigate={() => onZoomTo(segment.id)} />
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

/** Breadcrumb segments for the zoomed task level: ancestors as links, current zoom parent as the label. */
function zoomBreadcrumbTrail(tasks: Tasks, zoomParentId: string): readonly BreadcrumbSegment[] {
  const byId = taskByIdMap(tasks);
  return collectAncestorIds(tasks, zoomParentId).map(id => toBreadcrumbSegment(byId, id));
}
