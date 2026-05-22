import {useShallow} from 'zustand/shallow';

import * as styles from '@/components/appTopBar.css';
import {TaskBreadcrumb} from '@/components/TaskBreadcrumb';
import {useAppStore} from '@/stores/appStore';

/*
 * Component.
 */

export function AppTopBar() {
  const {projects, activeProjectId, tasks, zoomParentId, zoomTo} = useAppTopBarState();

  const projectName = projects.find(project => project.id === activeProjectId)?.name;

  return (
    <header class={styles.topBar}>
      <TaskBreadcrumb projectName={projectName} tasks={tasks} zoomParentId={zoomParentId} onZoomTo={zoomTo} />
    </header>
  );
}

/*
 * Hooks.
 */

function useAppTopBarState() {
  return useAppStore(
    useShallow(state => ({
      projects: state.projects,
      activeProjectId: state.activeProjectId,
      tasks: state.tasks,
      zoomParentId: state.zoomParentId,
      zoomTo: state.zoomTo
    }))
  );
}
