import {invoke} from '@tauri-apps/api/core';

import {type Workspace, type Workspaces, workspaceSchema, workspacesSchema} from '@/schemas/workspace';

export type {Workspace, Workspaces} from '@/schemas/workspace';

/*
 * API.
 */

export async function listWorkspaces(): Promise<Workspaces> {
  const rows = await invoke<unknown>('list_workspaces');
  return workspacesSchema.parse(rows);
}

export async function getActiveWorkspaceId(): Promise<string | undefined> {
  const activeId = await invoke<string | null | undefined>('get_active_workspace');
  return activeId ?? undefined;
}

export async function setActiveWorkspace(id: string): Promise<void> {
  await invoke('set_active_workspace', {id});
}

export async function addWorkspace(
  name: string,
  configPath: string,
  storagePath: string
): Promise<Workspace> {
  const row = await invoke<unknown>('add_workspace', {name, configPath, storagePath});
  return workspaceSchema.parse(row);
}
