import {invoke} from '@tauri-apps/api/core';

/*
 * Types.
 */

export type TaskStatus = 'pending' | 'in_progress' | 'done';

export type Task = {
  id: string;
  parentId: string | undefined;
  name: string;
  description: string | undefined;
  priority: number;
  completed: boolean;
  result: string | undefined;
  startedAt: string | undefined;
  completedAt: string | undefined;
  children: readonly string[];
  blockedBy: readonly string[];
};

export type Tasks = readonly Task[];

type TaskWire = {
  id: string;
  parent_id?: string | null;
  name: string;
  description?: string | null;
  priority: number;
  completed: boolean;
  result?: string | null;
  started_at?: string | null;
  completed_at?: string | null;
  children: readonly string[];
  blocked_by?: readonly string[];
  blockedBy: readonly string[];
};

type WireOptionalField = {
  wireKey: 'parent_id' | 'description' | 'result' | 'started_at' | 'completed_at';
  appKey: 'parentId' | 'description' | 'result' | 'startedAt' | 'completedAt';
};

/*
 * Constants.
 */

const WIRE_OPTIONAL_FIELDS: readonly WireOptionalField[] = [
  {wireKey: 'parent_id', appKey: 'parentId'},
  {wireKey: 'description', appKey: 'description'},
  {wireKey: 'result', appKey: 'result'},
  {wireKey: 'started_at', appKey: 'startedAt'},
  {wireKey: 'completed_at', appKey: 'completedAt'}
];

/*
 * API.
 */

export async function getTasks(projectId: string): Promise<Tasks> {
  const rows = await invoke<TaskWire[]>('get_tasks', {projectId});
  return rows.map(normalizeTask);
}

export async function getTask(projectId: string, taskId: string): Promise<Task> {
  const row = await invoke<TaskWire>('get_task', {projectId, taskId});
  return normalizeTask(row);
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

function normalizeTask(row: TaskWire): Task {
  return {
    id: row.id,
    name: row.name,
    priority: row.priority,
    completed: row.completed,
    children: row.children,
    blockedBy: row.blocked_by ?? row.blockedBy,
    ...taskWireOptionalFields(row)
  };
}

function taskWireOptionalFields(
  row: TaskWire
): Pick<Task, 'parentId' | 'description' | 'result' | 'startedAt' | 'completedAt'> {
  const fields: Partial<Pick<Task, 'parentId' | 'description' | 'result' | 'startedAt' | 'completedAt'>> = {};

  for (const {wireKey, appKey} of WIRE_OPTIONAL_FIELDS) {
    fields[appKey] = row[wireKey] ?? undefined;
  }

  return fields as Pick<Task, 'parentId' | 'description' | 'result' | 'startedAt' | 'completedAt'>;
}
