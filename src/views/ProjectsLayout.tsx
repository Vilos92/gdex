import {useEffect} from 'preact/hooks';

import {AppTopBar} from '@/components/AppTopBar';
import {ProjectSidebar} from '@/components/ProjectSidebar';
import {useAppStore} from '@/stores/appStore';
import {ProjectMain} from '@/views/ProjectMain';
import * as styles from '@/views/views.css';

/*
 * Component.
 */

export function ProjectsLayout() {
  useProjectTasksSync();

  return (
    <div class={styles.appFrame}>
      <AppTopBar />
      <div class={styles.shell}>
        <ProjectSidebar />
        <main class={styles.main}>
          <ProjectMain />
        </main>
      </div>
    </div>
  );
}

/*
 * Hooks.
 */

/** Keeps task list and `tasks-changed` listener in sync while the projects shell is mounted. */
function useProjectTasksSync() {
  const activeProjectId = useAppStore(state => state.activeProjectId);
  const reloadTasks = useAppStore(state => state.reloadTasks);
  const initTasksListener = useAppStore(state => state.initTasksListener);

  useEffect(() => {
    reloadTasks();
  }, [activeProjectId, reloadTasks]);

  useEffect(() => initTasksListener(), [activeProjectId, initTasksListener]);
}
