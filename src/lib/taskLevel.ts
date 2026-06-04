import {compareTasks, type Tasks} from '@/lib/taskApi';

/*
 * Helpers.
 */

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
