import {getActiveProjectId, type Projects, setActiveProject} from '@/lib/projectApi';

/*
 * Helpers.
 */

export async function loadProjectSelection(projects: Projects): Promise<string | undefined> {
  const activeId = await getActiveProjectId();
  if (activeId !== undefined && projects.some(project => project.id === activeId)) {
    return activeId;
  }
  const firstProject = projects[0];
  if (firstProject === undefined) {
    return undefined;
  }
  await setActiveProject(firstProject.id);
  return firstProject.id;
}
