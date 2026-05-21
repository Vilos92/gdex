import type {JSX} from 'preact';
import {useState} from 'preact/hooks';

import {ProjectRegisterForm} from '@/app/components/ProjectRegisterForm';
import * as styles from '@/app/components/projectSidebar.css';
import {type Project, type Projects, setActiveProject} from '@/lib/projectApi';

/*
 * Types.
 */

export type AddProjectPanelProps = {
  projects: Projects;
  activeProjectId: string | undefined;
  onProjectsChange: (projects: Projects, activeProjectId: string | undefined) => void;
};

/*
 * Component.
 */

export function AddProjectPanel({projects, activeProjectId, onProjectsChange}: AddProjectPanelProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);

  async function handleRegistered(project: Project) {
    const nextProjects = [...projects, project];
    if (activeProjectId === undefined) {
      await setActiveProject(project.id);
      onProjectsChange(nextProjects, project.id);
      setIsFormOpen(false);
      return;
    }

    onProjectsChange(nextProjects, activeProjectId);
    setIsFormOpen(false);
  }

  return (
    <div class={styles.addSection}>
      <button type="button" class={styles.addToggle} onClick={() => setIsFormOpen(open => !open)}>
        {isFormOpen ? 'Cancel' : 'Add project'}
      </button>
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
): JSX.Element | null {
  if (!isFormOpen) {
    return null;
  }
  return <ProjectRegisterForm onRegistered={onRegistered} />;
}
