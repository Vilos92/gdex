import {AddWorkspacePanel} from '@/components/WorkspaceSidebar/AddWorkspacePanel';
import {WorkspaceList} from '@/components/WorkspaceSidebar/WorkspaceList';
import * as styles from '@/components/WorkspaceSidebar/workspaceSidebar.css';
import type {Workspaces} from '@/lib/workspaceApi';

/*
 * Types.
 */

export type ExpandedWorkspaceSidebarBodyProps = {
  workspaces: Workspaces;
  activeWorkspaceId: string | undefined;
  isWorkspaceSwitching: boolean;
  selectError: string | undefined;
  isAddFormOpen: boolean;
  onAddFormOpenChange: (open: boolean) => void;
  onSelect: (workspaceId: string) => void;
};

/*
 * Component.
 */

export function ExpandedWorkspaceSidebarBody({
  workspaces,
  activeWorkspaceId,
  isWorkspaceSwitching,
  selectError,
  isAddFormOpen,
  onAddFormOpenChange,
  onSelect
}: ExpandedWorkspaceSidebarBodyProps) {
  return (
    <div class={styles.sidebarBody}>
      {selectError !== undefined ? (
        <p class={styles.selectError} role="alert">
          {selectError}
        </p>
      ) : undefined}
      <WorkspaceList
        workspaces={workspaces}
        activeWorkspaceId={activeWorkspaceId}
        isWorkspaceSwitching={isWorkspaceSwitching}
        onSelect={onSelect}
      />
      <AddWorkspacePanel isFormOpen={isAddFormOpen} onFormOpenChange={onAddFormOpenChange} />
    </div>
  );
}
