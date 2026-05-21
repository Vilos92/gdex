import {getActiveProjectId, type Projects, setActiveProject} from '@/lib/projectApi';

/*
 * Helpers.
 */

/** Load projects and ensure an active id when the store already has one. */
export async function loadProjectSelection(projects: Projects): Promise<string | undefined> {
  const activeId = await getActiveProjectId();
  if (activeId !== undefined) {
    return activeId;
  }
  const firstProject = projects[0];
  if (firstProject === undefined) {
    return undefined;
  }
  await setActiveProject(firstProject.id);
  return firstProject.id;
}
