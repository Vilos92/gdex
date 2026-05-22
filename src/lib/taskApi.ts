import {invoke} from '@tauri-apps/api/core';

import {type Task, type Tasks, tasksSchema} from '@/schemas/task';

export type {Task, Tasks} from '@/schemas/task';

/*
 * Types.
 */

export type TaskStatus = 'pending' | 'in_progress' | 'done';

/*
 * API.
 */

export async function getTasks(projectId: string): Promise<Tasks> {
  const rows = await invoke<unknown>('get_tasks', {projectId});
  return tasksSchema.parse(rows);
}

/*
 * Helpers.
 */

export function taskStatus(task: Task): TaskStatus {
  if (task.completed) {
    return 'done';
  }
  if (task.startedAt !== undefined) {
    return 'in_progress';
  }
  return 'pending';
}

/** Sort tasks by priority (desc), then name. */
export function compareTasks(left: Task, right: Task): number {
  if (right.priority !== left.priority) {
    return right.priority - left.priority;
  }
  return left.name.localeCompare(right.name);
}
