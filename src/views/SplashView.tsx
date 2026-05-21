import {ProjectRegisterForm} from '@/components/ProjectRegisterForm';
import type {Project} from '@/lib/projectApi';
import * as styles from '@/views/views.css';

/*
 * Types.
 */

export type SplashViewProps = {
  onRegistered: (project: Project) => void | Promise<void>;
};

/*
 * Component.
 */

export function SplashView({onRegistered}: SplashViewProps) {
  return (
    <div class={styles.splash}>
      <h1 class={styles.splashTitle}>gdex</h1>
      <p class={styles.splashSubtitle}>
        Register a dex project to browse tasks from your config and storage paths.
      </p>
      <ProjectRegisterForm onRegistered={onRegistered} />
    </div>
  );
}
