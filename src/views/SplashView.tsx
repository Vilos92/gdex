import {WorkspaceRegisterForm} from '@/components/WorkspaceRegisterForm/WorkspaceRegisterForm';
import type {Workspace} from '@/lib/workspaceApi';
import * as styles from '@/views/views.css';

/*
 * Types.
 */

export type SplashViewProps = {
  onRegistered: (workspace: Workspace) => void | Promise<void>;
};

/*
 * Component.
 */

export function SplashView({onRegistered}: SplashViewProps) {
  return (
    <div class={styles.splash}>
      <h1 class={styles.splashTitle}>gdex</h1>
      <p class={styles.splashSubtitle}>
        Register a dex workspace to browse tasks from your config and storage paths.
      </p>
      <WorkspaceRegisterForm onRegistered={onRegistered} />
    </div>
  );
}
