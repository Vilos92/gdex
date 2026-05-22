import {getActiveWorkspaceId, setActiveWorkspace, type Workspaces} from '@/lib/workspaceApi';

/*
 * Helpers.
 */

export async function loadWorkspaceSelection(workspaces: Workspaces): Promise<string | undefined> {
  const activeId = await getActiveWorkspaceId();
  if (activeId !== undefined && workspaces.some(workspace => workspace.id === activeId)) {
    return activeId;
  }
  const firstWorkspace = workspaces[0];
  if (firstWorkspace === undefined) {
    return undefined;
  }
  await setActiveWorkspace(firstWorkspace.id);
  return firstWorkspace.id;
}
