import type {JSX} from 'preact';

import type {useAppProjects} from '@/hooks/useAppProjects';
import {setActiveProject} from '@/lib/projectApi';
import {ProjectsLayout} from '@/views/ProjectsLayout';
import {SplashView} from '@/views/SplashView';
import * as styles from '@/views/views.css';

/*
 * Types.
 */

export type AppViewsProps = {
  app: ReturnType<typeof useAppProjects>;
};

/*
 * Component.
 */

export function AppViews({app}: AppViewsProps) {
  const viewRenderers: Record<typeof app.view, () => JSX.Element> = {
    loading: () => <p class={styles.loading}>Loading projects…</p>,
    error: () => (
      <div class={styles.loadError}>
        <p role="alert">{app.loadErrorMessage ?? 'Could not load projects.'}</p>
        <button
          type="button"
          onClick={() => {
            app.setView('loading');
            app.reloadProjects().catch(app.handleLoadError);
          }}
        >
          Retry
        </button>
      </div>
    ),
    splash: () => (
      <SplashView
        onRegistered={async project => {
          await setActiveProject(project.id);
          app.setProjects([project]);
          app.setActiveProjectId(project.id);
          app.setView('projects');
        }}
      />
    ),
    projects: () => (
      <ProjectsLayout
        projects={app.projects}
        activeProjectId={app.activeProjectId}
        onProjectsChange={(nextProjects, nextActiveId) => {
          app.setProjects(nextProjects);
          app.setActiveProjectId(nextActiveId);
        }}
      />
    )
  };

  return viewRenderers[app.view]();
}
