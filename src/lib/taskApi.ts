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

export async function getTasks(workspaceId: string): Promise<Tasks> {
  const rows = await invoke<unknown>('get_tasks', {workspaceId});
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

/** Sort by status group (in progress → pending → done), then priority (desc), then name. */
export function compareTasks(left: Task, right: Task): number {
  const statusOrder = taskStatusSortRank(taskStatus(left)) - taskStatusSortRank(taskStatus(right));
  if (statusOrder !== 0) {
    return statusOrder;
  }
  if (right.priority !== left.priority) {
    return right.priority - left.priority;
  }
  return left.name.localeCompare(right.name);
}

function taskStatusSortRank(status: TaskStatus): number {
  switch (status) {
    case 'in_progress':
      return 0;
    case 'pending':
      return 1;
    case 'done':
      return 2;
  }
}
