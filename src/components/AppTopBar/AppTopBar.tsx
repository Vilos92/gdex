import {useShallow} from 'zustand/shallow';

import * as styles from '@/components/AppTopBar/appTopBar.css';
import {TaskBreadcrumb} from '@/components/TaskBreadcrumb/TaskBreadcrumb';
import {useAppStore} from '@/stores/appStore';

/*
 * Component.
 */

export function AppTopBar() {
  const {workspaces, activeWorkspaceId, tasks, zoomParentId, selectedTaskId, navigateToTask} =
    useAppTopBarState();

  const workspaceName = workspaces.find(workspace => workspace.id === activeWorkspaceId)?.name;

  return (
    <header class={styles.topBar}>
      <TaskBreadcrumb
        workspaceName={workspaceName}
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
      workspaces: state.workspaces,
      activeWorkspaceId: state.activeWorkspaceId,
      tasks: state.tasks,
      zoomParentId: state.zoomParentId,
      selectedTaskId: state.selectedTaskId,
      navigateToTask: state.navigateToTask
    }))
  );
}
