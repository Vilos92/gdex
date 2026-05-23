import {CollapsedWorkspaceList} from '@/components/WorkspaceSidebar/CollapsedWorkspaceList';
import * as styles from '@/components/WorkspaceSidebar/workspaceSidebar.css';
import type {Workspaces} from '@/lib/workspaceApi';

/*
 * Types.
 */

export type CollapsedWorkspaceSidebarBodyProps = {
  workspaces: Workspaces;
  activeWorkspaceId: string | undefined;
  selectError: string | undefined;
  onSelect: (workspaceId: string) => void;
  onAddWorkspace: () => void;
};

/*
 * Component.
 */

export function CollapsedWorkspaceSidebarBody({
  workspaces,
  activeWorkspaceId,
  selectError,
  onSelect,
  onAddWorkspace
}: CollapsedWorkspaceSidebarBodyProps) {
  return (
    <div class={styles.sidebarCollapsedBody}>
      {selectError !== undefined ? (
        <p class={styles.selectError} role="alert">
          {selectError}
        </p>
      ) : undefined}
      <div class={styles.collapsedWorkspaceStrip}>
        <CollapsedWorkspaceList
          workspaces={workspaces}
          activeWorkspaceId={activeWorkspaceId}
          onSelect={onSelect}
        />
      </div>
      <button
        type="button"
        class={styles.collapsedAddButton}
        aria-label="Add workspace"
        onClick={onAddWorkspace}
      >
        +
      </button>
    </div>
  );
}
