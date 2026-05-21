import {invoke} from '@tauri-apps/api/core';

/*
 * Types.
 */

export type Project = {
  id: string;
  name: string;
  config_path: string;
  storage_path: string;
};

/** Immutable project collection — use for props and read-only parameters. */
export type Projects = readonly Project[];

/*
 * API.
 */

export async function listProjects(): Promise<Projects> {
  return invoke<Projects>('list_projects');
}

export async function getActiveProjectId(): Promise<string | undefined> {
  const activeId = await invoke<string | undefined>('get_active_project');
  return activeId ?? undefined;
}

export async function setActiveProject(id: string): Promise<void> {
  await invoke('set_active_project', {id});
}

export async function addProject(name: string, configPath: string, storagePath: string): Promise<Project> {
  return invoke<Project>('add_project', {name, configPath, storagePath});
}
