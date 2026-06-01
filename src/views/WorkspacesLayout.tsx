import {useEffect} from 'preact/hooks';

import {AppTopBar} from '@/components/AppTopBar/AppTopBar';
import {WorkspaceSidebar} from '@/components/WorkspaceSidebar/WorkspaceSidebar';
import {useAppStore} from '@/stores/appStore';
import * as styles from '@/views/views.css';
import {WorkspaceMain} from '@/views/WorkspaceMain';

/*
 * Component.
 */

export function WorkspacesLayout() {
  useWorkspaceTasksSync();

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
