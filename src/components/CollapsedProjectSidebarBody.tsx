import {CollapsedProjectList} from '@/components/CollapsedProjectList';
import * as styles from '@/components/projectSidebar.css';
import type {Projects} from '@/lib/projectApi';

/*
 * Types.
 */

export type CollapsedProjectSidebarBodyProps = {
  projects: Projects;
  activeProjectId: string | undefined;
  selectError: string | undefined;
  onSelect: (projectId: string) => void;
  onAddProject: () => void;
};

/*
 * Component.
 */

export function CollapsedProjectSidebarBody({
  projects,
  activeProjectId,
  selectError,
  onSelect,
  onAddProject
}: CollapsedProjectSidebarBodyProps) {
  return (
    <div class={styles.sidebarCollapsedBody}>
      {selectError !== undefined ? (
        <p class={styles.selectError} role="alert">
          {selectError}
        </p>
      ) : undefined}
      <div class={styles.collapsedProjectStrip}>
        <CollapsedProjectList projects={projects} activeProjectId={activeProjectId} onSelect={onSelect} />
      </div>
      <button type="button" class={styles.collapsedAddButton} aria-label="Add project" onClick={onAddProject}>
        +
      </button>
    </div>
  );
}
