import {invoke} from '@tauri-apps/api/core';

import {type Project, type Projects, projectSchema, projectsSchema} from '@/schemas/project';

export type {Project, Projects} from '@/schemas/project';

/*
 * API.
 */

export async function listProjects(): Promise<Projects> {
  const rows = await invoke<unknown>('list_projects');
  return projectsSchema.parse(rows);
}

export async function getActiveProjectId(): Promise<string | undefined> {
  const activeId = await invoke<string | null | undefined>('get_active_project');
  return activeId ?? undefined;
}

export async function setActiveProject(id: string): Promise<void> {
  await invoke('set_active_project', {id});
}

export async function addProject(name: string, configPath: string, storagePath: string): Promise<Project> {
  const row = await invoke<unknown>('add_project', {name, configPath, storagePath});
  return projectSchema.parse(row);
}
