import {Fragment} from 'preact';

import * as styles from '@/components/appTopBar.css';
import type {Tasks} from '@/lib/taskApi';

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

/** Walk `parentId` from `startId` to the root. Returns ids root-first. */
function collectAncestorIds(tasks: Tasks, startId: string): readonly string[] {
  const parentId = tasks.find(entry => entry.id === startId)?.parentId;
  return parentId === undefined ? [startId] : [...collectAncestorIds(tasks, parentId), startId];
}

/** Breadcrumb segments for the zoomed task level: ancestors as links, current zoom parent as the label. */
function zoomBreadcrumbTrail(tasks: Tasks, zoomParentId: string): readonly BreadcrumbSegment[] {
  return collectAncestorIds(tasks, zoomParentId).map(id => {
    const task = tasks.find(entry => entry.id === id);
    return {id: task?.id ?? id, name: task?.name ?? id};
  });
}
