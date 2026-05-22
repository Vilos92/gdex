import {AddProjectPanel} from '@/components/AddProjectPanel';
import {ProjectList} from '@/components/ProjectList';
import * as styles from '@/components/projectSidebar.css';
import type {Projects} from '@/lib/projectApi';

/*
 * Types.
 */

export type ExpandedProjectSidebarBodyProps = {
  projects: Projects;
  activeProjectId: string | undefined;
  selectError: string | undefined;
  isAddFormOpen: boolean;
  onAddFormOpenChange: (open: boolean) => void;
  onSelect: (projectId: string) => void;
};

/*
 * Component.
 */

export function ExpandedProjectSidebarBody({
  projects,
  activeProjectId,
  selectError,
  isAddFormOpen,
  onAddFormOpenChange,
  onSelect
}: ExpandedProjectSidebarBodyProps) {
  return (
    <div class={styles.sidebarBody}>
      {selectError !== undefined ? (
        <p class={styles.selectError} role="alert">
          {selectError}
        </p>
      ) : undefined}
      <ProjectList projects={projects} activeProjectId={activeProjectId} onSelect={onSelect} />
      <AddProjectPanel isFormOpen={isAddFormOpen} onFormOpenChange={onAddFormOpenChange} />
    </div>
  );
}
