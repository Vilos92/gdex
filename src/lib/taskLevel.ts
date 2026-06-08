import {compareTasks, type Tasks} from '@/lib/taskApi';

/*
 * Constants.
 */

/** Dex nesting limit (3 levels from workspace root). Example: epic → task → subtask. */
export const MAX_TASK_DEPTH = 3;

/*
 * Helpers.
 */

/** Levels from workspace root (1 = root task). Returns 0 when `taskId` is missing. Stops on cycles or missing parents. */
export function computeTaskDepth(tasks: Tasks, taskId: string): number {
  const byId = new Map(tasks.map(task => [task.id, task]));
  if (byId.get(taskId) === undefined) {
    return 0;
  }

  let depth = 0;
  let currentId: string | undefined = taskId;
  const visited = new Set<string>();

  while (currentId !== undefined) {
    if (visited.has(currentId)) {
      break;
    }
    const node = byId.get(currentId);
    if (node === undefined) {
      break;
    }
    visited.add(currentId);
    depth += 1;
    currentId = node.parentId;
  }

  return depth;
}

/** Sibling tasks visible at the current list zoom (`parentId` undefined = workspace root). */
export function tasksAtLevel(tasks: Tasks, parentId: string | undefined): Tasks {
  if (parentId === undefined) {
    return tasks.filter(task => task.parentId === undefined);
  }
  return tasks.filter(task => task.parentId === parentId);
}

/** `tasksAtLevel` ordered for the task list key movements. */
export function sortedTasksAtLevel(tasks: Tasks, zoomParentId: string | undefined): Tasks {
  return [...tasksAtLevel(tasks, zoomParentId)].sort(compareTasks);
}
