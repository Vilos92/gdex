import * as styles from '@/components/WorkspaceSidebar/workspaceSidebar.css';
import type {Workspaces} from '@/lib/workspaceApi';

/*
 * Types.
 */

export type WorkspaceListProps = {
  workspaces: Workspaces;
  activeWorkspaceId: string | undefined;
  onSelect: (workspaceId: string) => void;
};

/*
 * Styles.
 */

function workspaceButtonClass(isActive: boolean): string {
  return [styles.workspaceButton, isActive ? styles.workspaceButtonActive : ''].filter(Boolean).join(' ');
}

/*
 * Component.
 */

export function WorkspaceList({workspaces, activeWorkspaceId, onSelect}: WorkspaceListProps) {
  return (
    <ul class={styles.workspaceList}>
      {workspaces.map(workspace => {
        const isActive = workspace.id === activeWorkspaceId;
        return (
          <li key={workspace.id}>
            <button
              type="button"
              class={workspaceButtonClass(isActive)}
              aria-current={isActive ? 'true' : undefined}
              onClick={() => onSelect(workspace.id)}
            >
              {workspace.name}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
