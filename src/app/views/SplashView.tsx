import {ProjectRegisterForm} from '@/app/components/ProjectRegisterForm';
import * as styles from '@/app/views/views.css';
import type {Project} from '@/lib/projectApi';

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
