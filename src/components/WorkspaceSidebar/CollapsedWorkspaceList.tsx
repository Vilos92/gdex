import * as styles from '@/components/WorkspaceSidebar/workspaceSidebar.css';
import type {Workspaces} from '@/lib/workspaceApi';

/*
 * Types.
 */

export type CollapsedWorkspaceListProps = {
  workspaces: Workspaces;
  activeWorkspaceId: string | undefined;
  onSelect: (workspaceId: string) => void;
};

/*
 * Styles.
 */

function workspaceSquareClass(isActive: boolean): string {
  return [styles.collapsedWorkspaceSquare, isActive ? styles.collapsedWorkspaceSquareActive : '']
    .filter(Boolean)
    .join(' ');
}

/*
 * Component.
 */

export function CollapsedWorkspaceList({
  workspaces,
  activeWorkspaceId,
  onSelect
}: CollapsedWorkspaceListProps) {
  return (
    <ul class={styles.collapsedWorkspaceList}>
      {workspaces.map(workspace => {
        const isActive = workspace.id === activeWorkspaceId;
        const label = workspaceDisplayLabel(workspace.name);
        return (
          <li key={workspace.id}>
            <button
              type="button"
              class={workspaceSquareClass(isActive)}
              aria-current={isActive ? 'true' : undefined}
              aria-label={label}
              title={label}
              onClick={() => onSelect(workspace.id)}
            >
              {workspaceInitial(workspace.name)}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/*
 * Helpers.
 */

function workspaceDisplayLabel(name: string): string {
  const trimmed = name.trim();
  return trimmed.length > 0 ? trimmed : workspaceInitial(name);
}

function workspaceInitial(name: string): string {
  const trimmed = name.trim();
  if (trimmed.length === 0) {
    return '?';
  }
  const initial = trimmed[0];
  return initial === undefined ? '?' : initial.toLocaleUpperCase();
}
