import type {KeyAction} from '@/lib/keyboard/keyBindings';

/*
 * Constants.
 */

/** Pause after the first step before auto-repeat (VS Code–ish). */
export const MOVE_REPEAT_DELAY_MS = 400;

/** Interval in ms between repeated steps while the key is held. */
export const MOVE_REPEAT_INTERVAL_MS = 60;

const MOVE_UP_KEYS = new Set(['k', 'ArrowUp']);
const MOVE_DOWN_KEYS = new Set(['j', 'ArrowDown']);

/*
 * Types.
 */

export type MoveRepeatAction = Extract<KeyAction, 'moveUp' | 'moveDown'>;

type MoveRepeatSession = {
  action: MoveRepeatAction;
  key: string;
  delayTimer: ReturnType<typeof setTimeout>;
  intervalTimer: ReturnType<typeof setInterval> | undefined;
};

/*
 * Helpers.
 */

export function checkIsMoveRepeatKey(key: string): boolean {
  return MOVE_UP_KEYS.has(key) || MOVE_DOWN_KEYS.has(key);
}

export function moveRepeatActionForKey(key: string): MoveRepeatAction | undefined {
  if (MOVE_UP_KEYS.has(key)) {
    return 'moveUp';
  }
  if (MOVE_DOWN_KEYS.has(key)) {
    return 'moveDown';
  }
  return undefined;
}

export function createMoveRepeat(runStep: (action: MoveRepeatAction) => boolean): {
  begin: (key: string, action: MoveRepeatAction) => void;
  endIfKey: (key: string) => void;
  stop: () => void;
} {
  let session: MoveRepeatSession | undefined;

  const stop = () => {
    if (session === undefined) {
      return;
    }

    clearTimeout(session.delayTimer);
    if (session.intervalTimer !== undefined) {
      clearInterval(session.intervalTimer);
    }
    session = undefined;
  };

  const tick = () => {
    if (session === undefined) {
      return;
    }

    if (!runStep(session.action)) {
      stop();
    }
  };

  const begin = (key: string, action: MoveRepeatAction) => {
    stop();
    if (!runStep(action)) {
      return;
    }

    const delayTimer = setTimeout(() => {
      if (session === undefined || session.key !== key) {
        return;
      }

      tick();
      session.intervalTimer = setInterval(tick, MOVE_REPEAT_INTERVAL_MS);
    }, MOVE_REPEAT_DELAY_MS);

    session = {action, key, delayTimer, intervalTimer: undefined};
  };

  const endIfKey = (key: string) => {
    if (session?.key === key) {
      stop();
    }
  };

  return {begin, endIfKey, stop};
}
