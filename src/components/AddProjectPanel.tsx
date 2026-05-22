import type {JSX} from 'preact';
import {useState} from 'preact/hooks';

import {ProjectRegisterForm} from '@/components/ProjectRegisterForm';
import * as styles from '@/components/projectSidebar.css';
import {useFormOpenState} from '@/hooks/useFormOpenState';
import {invokeErrorMessage} from '@/lib/error';
import type {Project, Projects} from '@/lib/projectApi';
import {setActiveProject} from '@/lib/projectApi';
import {useAppStore} from '@/stores/appStore';

/*
 * Types.
 */

export type AddProjectPanelProps = {
  isFormOpen?: boolean;
  onFormOpenChange?: (open: boolean) => void;
};

/** Store slice and panel callbacks passed from `AddProjectPanel` into the register handler. */
type ProjectRegisterHandlerDeps = {
  projects: Projects;
  activeProjectId: string | undefined;
  setProjects: (projects: Projects) => void;
  setActiveProjectId: (id: string) => void;
  setActivationError: (message: string | undefined) => void;
  closeForm: () => void;
};

/*
 * Component.
 */

export function AddProjectPanel({isFormOpen: isFormOpenProp, onFormOpenChange}: AddProjectPanelProps = {}) {
  const {isOpen: isFormOpen, setIsOpen: setIsFormOpen} = useFormOpenState(isFormOpenProp, onFormOpenChange);
  const [activationError, setActivationError] = useState<string | undefined>(undefined);
  const projects = useAppStore(state => state.projects);
  const activeProjectId = useAppStore(state => state.activeProjectId);
  const setProjects = useAppStore(state => state.setProjects);
  const setActiveProjectId = useAppStore(state => state.setActiveProjectId);

  const handleRegistered = (project: Project) =>
    appendRegisteredProject(
      {
        projects,
        activeProjectId,
        setProjects,
        setActiveProjectId,
        setActivationError,
        closeForm: () => setIsFormOpen(false)
      },
      project
    );

  return (
    <div class={styles.addSection}>
      <button type="button" class={styles.addToggle} onClick={() => setIsFormOpen(!isFormOpen)}>
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

/**
 * Runs after `ProjectRegisterForm` succeeds: append the new project to the list, then
 * either stop or also activate it.
 *
 * When the app already has an active project, we only update `projects` and close the
 * form — the user keeps their current workspace.
 *
 * When there is no active project (typical first project), we also call
 * `set_active_project` so Rust and the store agree on selection; on failure we roll
 * back the list append and set `activationError` on the panel.
 */
async function appendRegisteredProject(deps: ProjectRegisterHandlerDeps, project: Project) {
  const nextProjects = [...deps.projects, project];
  deps.setActivationError(undefined);
  if (deps.activeProjectId !== undefined) {
    deps.setProjects(nextProjects);
    deps.closeForm();
    return;
  }

  deps.setProjects(nextProjects);
  try {
    await setActiveProject(project.id);
  } catch (error) {
    console.error('set_active_project failed', error);
    deps.setProjects(deps.projects);
    deps.setActivationError(invokeErrorMessage(error, 'Could not set active project.'));
    return;
  }
  deps.setActiveProjectId(project.id);
  deps.closeForm();
}

function renderRegisterForm(
  isFormOpen: boolean,
  onRegistered: (project: Project) => void | Promise<void>
): JSX.Element | undefined {
  if (!isFormOpen) {
    return undefined;
  }
  return <ProjectRegisterForm onRegistered={onRegistered} />;
}
