import {afterEach, beforeEach, describe, expect, test, vi} from 'vitest';

import {createMoveRepeat, MOVE_REPEAT_DELAY_MS, MOVE_REPEAT_INTERVAL_MS} from '@/lib/keyboard/moveRepeat';

/*
 * Tests.
 */

describe('createMoveRepeat', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('runs once immediately then repeats after the delay', () => {
    const steps: string[] = [];
    const repeat = createMoveRepeat(action => {
      steps.push(action);
      return true;
    });

    repeat.begin('j', 'moveDown');

    expect(steps).toEqual(['moveDown']);

    vi.advanceTimersByTime(MOVE_REPEAT_DELAY_MS);
    expect(steps).toEqual(['moveDown', 'moveDown']);

    vi.advanceTimersByTime(MOVE_REPEAT_INTERVAL_MS);
    expect(steps).toEqual(['moveDown', 'moveDown', 'moveDown']);

    repeat.endIfKey('j');
    vi.advanceTimersByTime(MOVE_REPEAT_INTERVAL_MS * 3);
    expect(steps).toEqual(['moveDown', 'moveDown', 'moveDown']);
  });

  test('does not start an interval when the delayed step fails', () => {
    let step = 0;
    const repeat = createMoveRepeat(() => {
      step += 1;
      return step === 1;
    });

    repeat.begin('j', 'moveDown');
    expect(step).toBe(1);

    vi.advanceTimersByTime(MOVE_REPEAT_DELAY_MS);
    expect(step).toBe(2);

    vi.advanceTimersByTime(MOVE_REPEAT_INTERVAL_MS * 3);
    expect(step).toBe(2);
  });

  test('stops when endIfKey matches the key that started the session', () => {
    const steps: string[] = [];
    const repeat = createMoveRepeat(action => {
      steps.push(action);
      return true;
    });

    repeat.begin('k', 'moveUp');
    repeat.endIfKey('k');

    vi.advanceTimersByTime(MOVE_REPEAT_DELAY_MS + MOVE_REPEAT_INTERVAL_MS * 2);
    expect(steps).toEqual(['moveUp']);
  });
});
