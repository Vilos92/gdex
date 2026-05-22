import * as styles from '@/components/appTopBar.css';
import {TaskBreadcrumb} from '@/components/TaskBreadcrumb';
import type {Tasks} from '@/lib/taskApi';

/*
 * Types.
 */

export type AppTopBarProps = {
  projectName: string | undefined;
  tasks: Tasks;
  zoomParentId: string | undefined;
  onZoomTo: (taskId: string | undefined) => void;
};

/*
 * Component.
 */

export function AppTopBar({projectName, tasks, zoomParentId, onZoomTo}: AppTopBarProps) {
  return (
    <header class={styles.topBar}>
      <TaskBreadcrumb
        projectName={projectName}
        tasks={tasks}
        zoomParentId={zoomParentId}
        onZoomTo={onZoomTo}
      />
    </header>
  );
}
