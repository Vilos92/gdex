import {useEffect} from 'preact/hooks';

import {AppTopBar} from '@/components/AppTopBar';
import {WorkspaceSidebar} from '@/components/WorkspaceSidebar';
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

/** Keeps task list and `tasks-changed` listener in sync while the workspaces shell is mounted. */
function useWorkspaceTasksSync() {
  const activeWorkspaceId = useAppStore(state => state.activeWorkspaceId);
  const reloadTasks = useAppStore(state => state.reloadTasks);
  const initTasksListener = useAppStore(state => state.initTasksListener);

  useEffect(() => {
    reloadTasks();
  }, [activeWorkspaceId, reloadTasks]);

  useEffect(() => {
    const unsubscribe = initTasksListener();
    return unsubscribe;
  }, [initTasksListener]);
}
