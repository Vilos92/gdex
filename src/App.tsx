import type {JSX} from 'preact';
import {useEffect} from 'preact/hooks';
import {useShallow} from 'zustand/shallow';

import {setActiveProject} from '@/lib/projectApi';
import {type AppView, useAppStore} from '@/stores/appStore';
import {ProjectsLayout} from '@/views/ProjectsLayout';
import {SplashView} from '@/views/SplashView';
import * as styles from '@/views/views.css';

/*
 * Component.
 */

function App() {
  useAppBootstrap();

  const {
    view,
    projectsLoadError,
    setView,
    setProjects,
    setActiveProjectId,
    reloadProjects,
    handleProjectsLoadError
  } = useAppShellState();

  const viewRenderers: Record<AppView, () => JSX.Element> = {
    loading: () => <p class={styles.loading}>Loading projects…</p>,
    error: () => (
      <div class={styles.loadError}>
        <p role="alert">{projectsLoadError ?? 'Could not load projects.'}</p>
        <button
          type="button"
          onClick={() => {
            setView('loading');
            reloadProjects().catch(handleProjectsLoadError);
          }}
        >
          Retry
        </button>
      </div>
    ),
    splash: () => (
      <SplashView
        onRegistered={async project => {
          try {
            await setActiveProject(project.id);
          } catch (error) {
            handleProjectsLoadError(error);
            return;
          }
          setProjects([project]);
          setActiveProjectId(project.id);
          setView('projects');
        }}
      />
    ),
    projects: () => <ProjectsLayout />
  };

  return viewRenderers[view]();
}

export default App;

/*
 * Hooks.
 */

function useAppBootstrap() {
  const reloadProjects = useAppStore(state => state.reloadProjects);
  const handleProjectsLoadError = useAppStore(state => state.handleProjectsLoadError);

  useEffect(() => {
    reloadProjects().catch(handleProjectsLoadError);
  }, [reloadProjects, handleProjectsLoadError]);
}

function useAppShellState() {
  return useAppStore(
    useShallow(state => ({
      view: state.view,
      projectsLoadError: state.projectsLoadError,
      setView: state.setView,
      setProjects: state.setProjects,
      setActiveProjectId: state.setActiveProjectId,
      reloadProjects: state.reloadProjects,
      handleProjectsLoadError: state.handleProjectsLoadError
    }))
  );
}
