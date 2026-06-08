import {
  checkHasAgentPromptMenu,
  checkIsEditableKeyboardTarget,
  checkIsTargetInWorkspaceSidebar
} from '@/lib/keyboard/scope';

/*
 * Constants.
 */

export const QUICK_PROMPT_KEY_BINDINGS = [
  {tinykey: '$mod+1', slotIndex: 0},
  {tinykey: '$mod+2', slotIndex: 1},
  {tinykey: '$mod+3', slotIndex: 2},
  {tinykey: '$mod+4', slotIndex: 3},
  {tinykey: '$mod+5', slotIndex: 4},
  {tinykey: '$mod+c', action: 'copy' as const}
] as const;

/*
 * Helpers.
 */

/** Inline quick prompts — defer while typing, sidebar focus, or the context menu owns the keyboard. */
export function checkShouldHandleQuickPromptShortcut(target: EventTarget | null): boolean {
  return (
    !checkHasAgentPromptMenu() &&
    !checkIsEditableKeyboardTarget(target) &&
    !checkIsTargetInWorkspaceSidebar(target)
  );
}

export function resolveQuickPromptSlotSelection<TId extends string>(
  prompts: readonly {id: TId; isAvailable: boolean}[],
  slotIndex: number
): TId | undefined {
  const prompt = prompts[slotIndex];
  if (prompt === undefined || !prompt.isAvailable) {
    return undefined;
  }

  return prompt.id;
}

export function resolveActiveQuickPromptText<TId extends string>(
  prompts: readonly {id: TId; text: string}[],
  selectedId: TId
): string | undefined {
  return prompts.find(prompt => prompt.id === selectedId)?.text;
}
