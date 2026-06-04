import {describe, expect, test} from 'vitest';

import type {Task} from '@/lib/taskApi';
import {sortedTasksAtLevel} from '@/lib/taskLevel';

/*
 * Constants.
 */

const rootA: Task = {
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

const childA1: Task = {
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

const rootB: Task = {
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

const tasks = [rootA, childA1, rootB];

/*
 * Tests.
 */

describe('sortedTasksAtLevel', () => {
  test('returns root tasks sorted by compareTasks', () => {
    expect(sortedTasksAtLevel(tasks, undefined).map(task => task.id)).toEqual(['a', 'b']);
  });
});
