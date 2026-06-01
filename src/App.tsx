import type {JSX} from 'preact';
import {useEffect} from 'preact/hooks';
import {useShallow} from 'zustand/shallow';

import {subscribeToSystemColorScheme} from '@/lib/theme';
import {setActiveWorkspace} from '@/lib/workspaceApi';
import {type AppView, useAppStore} from '@/stores/appStore';
import {SplashView} from '@/views/SplashView';
import * as styles from '@/views/views.css';
import {WorkspacesLayout} from '@/views/WorkspacesLayout';

/*
 * Component.
 */

function App() {
  useAppBootstrap();

  const {
    view,
    workspacesLoadError,
    setView,
    setWorkspaces,
    setActiveWorkspaceId,
    reloadWorkspaces,
    handleWorkspacesLoadError
  } = useAppShellState();

  const viewRenderers: Record<AppView, () => JSX.Element> = {
    loading: () => <p class={styles.loading}>Loading workspaces…</p>,
    error: () => (
      <div class={styles.loadError}>
        <p role="alert">{workspacesLoadError ?? 'Could not load workspaces.'}</p>
        <button
          type="button"
          onClick={() => {
            setView('loading');
            reloadWorkspaces().catch(handleWorkspacesLoadError);
          }}
        >
          Retry
        </button>
      </div>
    ),
    splash: () => (
      <SplashView
        onRegistered={async workspace => {
          try {
            await setActiveWorkspace(workspace.id);
          } catch (error) {
            handleWorkspacesLoadError(error);
            return;
          }
          setWorkspaces([workspace]);
          setActiveWorkspaceId(workspace.id);
          setView('workspaces');
        }}
      />
    ),
    workspaces: () => <WorkspacesLayout />
  };

  return viewRenderers[view]();
}

export default App;

/*
 * Hooks.
 */

function useAppBootstrap() {
  const reloadWorkspaces = useAppStore(state => state.reloadWorkspaces);
  const handleWorkspacesLoadError = useAppStore(state => state.handleWorkspacesLoadError);
  const hydrateTheme = useAppStore(state => state.hydrateTheme);
  const handleSystemColorSchemeChange = useAppStore(state => state.handleSystemColorSchemeChange);

  useEffect(() => {
    hydrateTheme().catch(error => {
      console.error('theme hydrate failed', error);
    });
    reloadWorkspaces().catch(handleWorkspacesLoadError);
  }, [hydrateTheme, reloadWorkspaces, handleWorkspacesLoadError]);

  useEffect(
    () => subscribeToSystemColorScheme(handleSystemColorSchemeChange),
    [handleSystemColorSchemeChange]
  );
}

function useAppShellState() {
  return useAppStore(
    useShallow(state => ({
      view: state.view,
      workspacesLoadError: state.workspacesLoadError,
      setView: state.setView,
      setWorkspaces: state.setWorkspaces,
      setActiveWorkspaceId: state.setActiveWorkspaceId,
      reloadWorkspaces: state.reloadWorkspaces,
      handleWorkspacesLoadError: state.handleWorkspacesLoadError
    }))
  );
}
