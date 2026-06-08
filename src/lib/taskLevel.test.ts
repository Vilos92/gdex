import {describe, expect, test} from 'vitest';

import {SAMPLE_TASKS} from '@/lib/sampleTasks.fixture';
import type {Task, Tasks} from '@/lib/taskApi';
import {computeTaskDepth, MAX_TASK_DEPTH, sortedTasksAtLevel} from '@/lib/taskLevel';

/*
 * Constants.
 */

const DEPTH_ROOT = depthProbeTask({id: 'root'});
const DEPTH_CHILD = depthProbeTask({id: 'child', parentId: 'root'});
const DEPTH_GRANDCHILD = depthProbeTask({id: 'grandchild', parentId: 'child'});
const DEPTH_GREAT_GRANDCHILD = depthProbeTask({id: 'great', parentId: 'grandchild'});

const DEPTH_AT_MAX: Tasks = [DEPTH_ROOT, DEPTH_CHILD, DEPTH_GRANDCHILD];
const DEPTH_BEYOND_MAX: Tasks = [DEPTH_ROOT, DEPTH_CHILD, DEPTH_GRANDCHILD, DEPTH_GREAT_GRANDCHILD];

const CYCLE_A = depthProbeTask({id: 'cycle-a', parentId: 'cycle-b'});
const CYCLE_B = depthProbeTask({id: 'cycle-b', parentId: 'cycle-a'});
const CYCLE_TASKS: Tasks = [CYCLE_A, CYCLE_B];

const ORPHAN_PARENT = depthProbeTask({id: 'orphan', parentId: 'missing-parent'});

/*
 * Tests.
 */

describe('computeTaskDepth', () => {
  test('counts levels from workspace root', () => {
    expect(computeTaskDepth(SAMPLE_TASKS, 'a')).toBe(1);
    expect(computeTaskDepth(SAMPLE_TASKS, 'a1')).toBe(2);
  });

  test('returns max depth for the deepest valid ancestor chain', () => {
    expect(computeTaskDepth(DEPTH_AT_MAX, 'grandchild')).toBe(MAX_TASK_DEPTH);
  });

  test('counts depths beyond the dex nesting limit without capping', () => {
    expect(computeTaskDepth(DEPTH_BEYOND_MAX, 'great')).toBe(MAX_TASK_DEPTH + 1);
  });

  test('stops on cyclic parent chains', () => {
    expect(computeTaskDepth(CYCLE_TASKS, 'cycle-a')).toBe(2);
    expect(computeTaskDepth(CYCLE_TASKS, 'cycle-b')).toBe(2);
  });

  test('stops when parentId points to a missing task', () => {
    expect(computeTaskDepth([ORPHAN_PARENT], 'orphan')).toBe(1);
  });

  test('returns 0 for a missing task id', () => {
    expect(computeTaskDepth(SAMPLE_TASKS, 'missing-id')).toBe(0);
  });
});

describe('sortedTasksAtLevel', () => {
  test('returns root tasks sorted by compareTasks', () => {
    expect(sortedTasksAtLevel(SAMPLE_TASKS, undefined).map(task => task.id)).toEqual(['a', 'b']);
  });

  test('returns child tasks under a zoom parent', () => {
    expect(sortedTasksAtLevel(SAMPLE_TASKS, 'a').map(task => task.id)).toEqual(['a1']);
  });
});

/*
 * Helpers.
 */

function depthProbeTask(overrides: Partial<Task> & Pick<Task, 'id'>): Task {
  return {
    parentId: undefined,
    name: overrides.id,
    description: undefined,
    priority: 1,
    completed: false,
    result: undefined,
    startedAt: undefined,
    completedAt: undefined,
    children: [],
    blockedBy: [],
    ...overrides
  };
}
