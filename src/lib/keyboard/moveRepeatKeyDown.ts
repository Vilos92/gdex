import {type createMoveRepeat, moveRepeatActionForKey} from '@/lib/keyboard/moveRepeat';

/*
 * Helpers.
 */

/**
 * Move-repeat listens on raw keydown (not tinykeys) so hold timing stays separate from chord bindings.
 * No-ops without `preventDefault` when the key or scope isn't a repeat driver.
 */
export function handleMoveRepeatKeyDown(
  event: KeyboardEvent,
  moveRepeat: ReturnType<typeof createMoveRepeat>,
  shouldHandle: (event: KeyboardEvent) => boolean
): void {
  const moveAction = moveRepeatActionForKey(event.key);
  if (moveAction === undefined || !shouldHandle(event) || event.repeat) {
    return;
  }

  event.preventDefault();
  moveRepeat.begin(event.key, moveAction);
}
