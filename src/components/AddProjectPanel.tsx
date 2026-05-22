import type {JSX} from 'preact';
import {useState} from 'preact/hooks';

import {ProjectRegisterForm} from '@/components/ProjectRegisterForm';
import * as styles from '@/components/projectSidebar.css';
import {invokeErrorMessage} from '@/lib/error';
import type {Project} from '@/lib/projectApi';
import {setActiveProject} from '@/lib/projectApi';
import {useAppStore} from '@/stores/appStore';

/*
 * Component.
 */

export function AddProjectPanel() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activationError, setActivationError] = useState<string | undefined>(undefined);
  const projects = useAppStore(state => state.projects);
  const activeProjectId = useAppStore(state => state.activeProjectId);
  const setProjects = useAppStore(state => state.setProjects);
  const setActiveProjectId = useAppStore(state => state.setActiveProjectId);

  async function handleRegistered(project: Project) {
    const nextProjects = [...projects, project];
    if (activeProjectId === undefined) {
      setProjects(nextProjects);
      setActivationError(undefined);
      try {
        await setActiveProject(project.id);
      } catch (error) {
        console.error('set_active_project failed', error);
        setProjects(projects);
        setActivationError(invokeErrorMessage(error, 'Could not set active project.'));
        return;
      }
      setActiveProjectId(project.id);
      setIsFormOpen(false);
      return;
    }

    setProjects(nextProjects);
    setIsFormOpen(false);
  }

  return (
    <div class={styles.addSection}>
      <button type="button" class={styles.addToggle} onClick={() => setIsFormOpen(open => !open)}>
        {isFormOpen ? 'Cancel' : 'Add project'}
      </button>
      {activationError !== undefined ? (
        <p class={styles.selectError} role="alert">
          {activationError}
        </p>
      ) : undefined}
      {renderRegisterForm(isFormOpen, handleRegistered)}
    </div>
  );
}

/*
 * Helpers.
 */

function renderRegisterForm(
  isFormOpen: boolean,
  onRegistered: (project: Project) => void | Promise<void>
): JSX.Element | undefined {
  if (!isFormOpen) {
    return undefined;
  }
  return <ProjectRegisterForm onRegistered={onRegistered} />;
}
