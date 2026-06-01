import {useShallow} from 'zustand/shallow';

import * as styles from '@/components/AppTopBar/appTopBar.css';
import {ThemeModeToggle} from '@/components/AppTopBar/ThemeModeToggle';
import {TaskBreadcrumb} from '@/components/TaskBreadcrumb/TaskBreadcrumb';
import {useAppStore} from '@/stores/appStore';

/*
 * Component.
 */

export function AppTopBar() {
  const {
    workspaces,
    activeWorkspaceId,
    tasks,
    zoomParentId,
    selectedTaskId,
    navigateToTask,
    themeMode,
    cycleThemeMode
  } = useAppTopBarState();

  const workspaceName = workspaces.find(workspace => workspace.id === activeWorkspaceId)?.name;

  return (
    <header class={styles.topBar}>
      <div class={styles.topBarMain}>
        <TaskBreadcrumb
          workspaceName={workspaceName}
          tasks={tasks}
          zoomParentId={zoomParentId}
          selectedTaskId={selectedTaskId}
          onNavigateTo={navigateToTask}
        />
      </div>
      <ThemeModeToggle mode={themeMode} onCycle={() => cycleThemeMode().catch(logThemeError)} />
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
      navigateToTask: state.navigateToTask,
      themeMode: state.themeMode,
      cycleThemeMode: state.cycleThemeMode
    }))
  );
}

/*
 * Helpers.
 */

function logThemeError(error: unknown): void {
  console.error('theme update failed', error);
}
