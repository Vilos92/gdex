import {useEffect, useState} from 'preact/hooks';

import {invokeErrorMessage} from '@/lib/error';
import {listProjects, type Projects} from '@/lib/projectApi';
import {loadProjectSelection} from '@/lib/projectSelection';

/*
 * Types.
 */

type AppView = 'loading' | 'splash' | 'projects' | 'error';

/*
 * Hooks.
 */

export function useAppProjects() {
  const [view, setView] = useState<AppView>('loading');
  const [projects, setProjects] = useState<Projects>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | undefined>(undefined);
  const [loadErrorMessage, setLoadErrorMessage] = useState<string | undefined>(undefined);

  async function reloadProjects() {
    const loadedProjects = await listProjects();
    if (loadedProjects.length === 0) {
      setProjects([]);
      setActiveProjectId(undefined);
      setView('splash');
      return;
    }

    const activeId = await loadProjectSelection(loadedProjects);
    setProjects(loadedProjects);
    setActiveProjectId(activeId);
    setView('projects');
  }

  function handleLoadError(error: unknown) {
    console.error('project load failed', error);
    setLoadErrorMessage(invokeErrorMessage(error, 'Could not load projects.'));
    setView('error');
  }

  useEffect(() => {
    reloadProjects().catch(handleLoadError);
  }, []);

  return {
    view,
    projects,
    activeProjectId,
    loadErrorMessage,
    setProjects,
    setActiveProjectId,
    setView,
    reloadProjects,
    handleLoadError
  };
}
