import {describe, expect, test} from 'vitest';

import {SAMPLE_TASKS} from '@/lib/sampleTasks.fixture';
import {sortedTasksAtLevel} from '@/lib/taskLevel';

/*
 * Tests.
 */

describe('sortedTasksAtLevel', () => {
  test('returns root tasks sorted by compareTasks', () => {
    expect(sortedTasksAtLevel(SAMPLE_TASKS, undefined).map(task => task.id)).toEqual(['a', 'b']);
  });

  test('returns child tasks under a zoom parent', () => {
    expect(sortedTasksAtLevel(SAMPLE_TASKS, 'a').map(task => task.id)).toEqual(['a1']);
  });
});
