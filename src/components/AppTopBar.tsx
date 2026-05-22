import {useShallow} from 'zustand/shallow';

import * as styles from '@/components/appTopBar.css';
import {TaskBreadcrumb} from '@/components/TaskBreadcrumb';
import {useAppStore} from '@/stores/appStore';

/*
 * Component.
 */

export function AppTopBar() {
  const {projects, activeProjectId, tasks, zoomParentId, selectedTaskId, navigateToTask} =
    useAppTopBarState();

  const projectName = projects.find(project => project.id === activeProjectId)?.name;

  return (
    <header class={styles.topBar}>
      <TaskBreadcrumb
        projectName={projectName}
        tasks={tasks}
        zoomParentId={zoomParentId}
        selectedTaskId={selectedTaskId}
        onNavigateTo={navigateToTask}
      />
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
      selectedTaskId: state.selectedTaskId,
      navigateToTask: state.navigateToTask
    }))
  );
}
