import type {Workspaces} from '@/schemas/workspace';

/*
 * Types.
 */

export type WorkspaceCycleDirection = 'next' | 'prev';

/*
 * Helpers.
 */

/** Next or previous workspace id in the registered list, wrapping at both ends. */
export function resolveAdjacentWorkspaceId(
  workspaces: Workspaces,
  activeWorkspaceId: string | undefined,
  direction: WorkspaceCycleDirection
): string | undefined {
  if (workspaces.length === 0) {
    return undefined;
  }

  const currentIndex =
    activeWorkspaceId === undefined
      ? -1
      : workspaces.findIndex(workspace => workspace.id === activeWorkspaceId);

  const startIndex = currentIndex < 0 ? 0 : currentIndex;
  const delta = direction === 'next' ? 1 : -1;
  const nextIndex = (startIndex + delta + workspaces.length) % workspaces.length;
  return workspaces[nextIndex]?.id;
}
