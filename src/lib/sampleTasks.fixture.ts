import type {Task, Tasks} from '@/lib/taskApi';

/*
 * Constants.
 */

const SAMPLE_ROOT_A: Task = {
  id: 'a',
  parentId: undefined,
  name: 'Alpha',
  description: undefined,
  priority: 1,
  completed: false,
  result: undefined,
  startedAt: undefined,
  completedAt: undefined,
  children: ['a1'],
  blockedBy: []
};

const SAMPLE_CHILD_A1: Task = {
  id: 'a1',
  parentId: 'a',
  name: 'Alpha child',
  description: undefined,
  priority: 1,
  completed: false,
  result: undefined,
  startedAt: undefined,
  completedAt: undefined,
  children: [],
  blockedBy: []
};

const SAMPLE_ROOT_B: Task = {
  id: 'b',
  parentId: undefined,
  name: 'Beta',
  description: undefined,
  priority: 0,
  completed: false,
  result: undefined,
  startedAt: undefined,
  completedAt: undefined,
  children: [],
  blockedBy: []
};

/** Small task tree for unit tests (root `a` with child `a1`, root `b`). */
export const SAMPLE_TASKS: Tasks = [SAMPLE_ROOT_A, SAMPLE_CHILD_A1, SAMPLE_ROOT_B];
