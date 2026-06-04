import {describe, expect, test} from 'vitest';

import {applyBackAction, applyKeyAction} from '@/lib/keyboard/taskListNavigation';
import {SAMPLE_TASKS} from '@/lib/sampleTasks.fixture';

/*
 * Constants.
 */

const stateAtChild = {
  tasks: SAMPLE_TASKS,
  zoomParentId: 'a' as string | undefined,
  selectedTaskId: 'a1' as string | undefined
};

/*
 * Tests.
 */

describe('applyKeyAction', () => {
  test('moveDown selects first row when nothing is selected', () => {
    const patch = applyKeyAction(
      {tasks: SAMPLE_TASKS, zoomParentId: undefined, selectedTaskId: undefined},
      'moveDown'
    );
    expect(patch?.selectedTaskId).toBe('a');
  });

  test('zoomIn drills into children when a task is selected', () => {
    const patch = applyKeyAction(
      {tasks: SAMPLE_TASKS, zoomParentId: undefined, selectedTaskId: 'a'},
      'zoomIn'
    );
    expect(patch).toEqual({zoomParentId: 'a', selectedTaskId: 'a1'});
  });

  test('zoomIn selects the first root task when nothing is selected', () => {
    const patch = applyKeyAction(
      {tasks: SAMPLE_TASKS, zoomParentId: undefined, selectedTaskId: undefined},
      'zoomIn'
    );
    expect(patch).toEqual({zoomParentId: undefined, selectedTaskId: 'a'});
  });

  test('zoomIn does nothing when the task has no subtasks', () => {
    const patch = applyKeyAction(
      {tasks: SAMPLE_TASKS, zoomParentId: undefined, selectedTaskId: 'b'},
      'zoomIn'
    );
    expect(patch).toBeUndefined();
  });

  test('zoomOut from nested level selects parent', () => {
    const patch = applyKeyAction(stateAtChild, 'zoomOut');
    expect(patch).toEqual({zoomParentId: undefined, selectedTaskId: 'a'});
  });

  test('zoomOut at root clears selection', () => {
    const patch = applyKeyAction(
      {tasks: SAMPLE_TASKS, zoomParentId: undefined, selectedTaskId: 'b'},
      'zoomOut'
    );
    expect(patch).toEqual({zoomParentId: undefined, selectedTaskId: undefined});
  });
});

describe('applyBackAction', () => {
  test('from detail pane focuses the list without changing zoom', () => {
    const result = applyBackAction(stateAtChild, true);
    expect(result).toBe('focusList');
  });

  test('from the list zooms out one breadcrumb level', () => {
    const result = applyBackAction(stateAtChild, false);
    expect(result).toEqual({zoomParentId: undefined, selectedTaskId: 'a'});
  });
});
