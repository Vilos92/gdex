import * as styles from '@/components/WorkspaceSidebar/workspaceSidebar.css';
import type {Workspaces} from '@/lib/workspaceApi';
import {workspaceSwatchIndex} from '@/lib/workspaceSwatch';
import * as swatchStyles from '@/styles/workspaceSwatches.css';

/*
 * Types.
 */

export type CollapsedWorkspaceListProps = {
  workspaces: Workspaces;
  activeWorkspaceId: string | undefined;
  isWorkspaceSwitching: boolean;
  onSelect: (workspaceId: string) => void;
};

/*
 * Component.
 */

export function CollapsedWorkspaceList({
  workspaces,
  activeWorkspaceId,
  isWorkspaceSwitching,
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
              class={workspaceSquareClass(isActive, workspace.name)}
              aria-current={isActive ? 'true' : undefined}
              aria-label={label}
              title={label}
              disabled={isWorkspaceSwitching}
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

function workspaceSquareClass(isActive: boolean, name: string): string {
  return [
    styles.collapsedWorkspaceSquare,
    workspaceLetterClass(name),
    isActive ? styles.collapsedWorkspaceSquareActive : ''
  ]
    .filter(Boolean)
    .join(' ');
}

function workspaceLetterClass(name: string): string {
  const swatchIndex = workspaceSwatchIndex(name);
  const letterClass = swatchStyles.collapsedWorkspaceSwatchLetterStyles[swatchIndex];
  if (letterClass === undefined) {
    throw new Error(`Missing collapsed workspace swatch letter style at index ${swatchIndex}`);
  }

  return letterClass;
}

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
