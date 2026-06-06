import {useEffect} from 'preact/hooks';
import {useShallow} from 'zustand/shallow';

import {AppTopBar} from '@/components/AppTopBar/AppTopBar';
import {WorkspaceSidebar} from '@/components/WorkspaceSidebar/WorkspaceSidebar';
import {useWindowKeyboard} from '@/hooks/useWindowKeyboard';
import {useAppStore} from '@/stores/appStore';
import * as styles from '@/views/views.css';
import {WorkspaceMain} from '@/views/WorkspaceMain';

/*
 * Component.
 */

export function WorkspacesLayout() {
  useWorkspaceTasksSync();
  useWorkspaceKeyboard();

  return (
    <div class={styles.appFrame}>
      <AppTopBar />
      <div class={styles.shell}>
        <WorkspaceSidebar />
        <main class={styles.main}>
          <WorkspaceMain />
        </main>
      </div>
    </div>
  );
}

/*
 * Hooks.
 */

/** Runs once on mount so the first workspace gets an enter transition without duplicating the sidebar switch flow. */
function useWorkspaceTasksSync() {
  const loadActiveWorkspaceTasks = useAppStore(state => state.loadActiveWorkspaceTasks);
  const initTasksListener = useAppStore(state => state.initTasksListener);

  useEffect(() => {
    loadActiveWorkspaceTasks();
  }, [loadActiveWorkspaceTasks]);

  useEffect(() => {
    const unsubscribe = initTasksListener();
    return unsubscribe;
  }, [initTasksListener]);
}

/**
 * Shell-level keyboard — one window listener spans sidebar and main so chrome shortcuts
 * work outside the task board. Task-list keys still gate on main visibility.
 */
function useWorkspaceKeyboard() {
  const {
    isWorkspaceMainVisible,
    tasks,
    zoomParentId,
    selectedTaskId,
    setTaskListNavigation,
    workspaces,
    activeWorkspaceId,
    isTasksLoading,
    switchWorkspace,
    toggleSidebarCollapsed,
    cycleThemeMode
  } = useAppStore(
    useShallow(state => ({
      isWorkspaceMainVisible: state.isWorkspaceMainVisible,
      tasks: state.tasks,
      zoomParentId: state.zoomParentId,
      selectedTaskId: state.selectedTaskId,
      setTaskListNavigation: state.setTaskListNavigation,
      workspaces: state.workspaces,
      activeWorkspaceId: state.activeWorkspaceId,
      isTasksLoading: state.isTasksLoading,
      switchWorkspace: state.switchWorkspace,
      toggleSidebarCollapsed: state.toggleSidebarCollapsed,
      cycleThemeMode: state.cycleThemeMode
    }))
  );

  useWindowKeyboard({
    isTaskListEnabled: isWorkspaceMainVisible,
    tasks,
    zoomParentId,
    selectedTaskId,
    onApplyNavigation: setTaskListNavigation,
    workspaces,
    activeWorkspaceId,
    isWorkspaceSwitching: isTasksLoading && !isWorkspaceMainVisible,
    switchWorkspace,
    toggleSidebarCollapsed,
    cycleThemeMode
  });
}
