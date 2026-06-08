import {describe, expect, test} from 'vitest';

import {
  resolveActiveQuickPromptText,
  resolveQuickPromptSlotSelection
} from '@/lib/keyboard/quickPromptShortcuts';

/*
 * Tests.
 */

type TestPrompt<TId extends string> = {
  id: TId;
  label: string;
  text: string;
  isAvailable: boolean;
};

const TASK_PROMPTS: readonly TestPrompt<'view' | 'add-subtask' | 'start' | 'complete' | 'delete'>[] = [
  {id: 'view', label: 'Look at task', text: 'view text', isAvailable: true},
  {id: 'add-subtask', label: 'Add subtask', text: 'add subtask text', isAvailable: true},
  {id: 'start', label: 'Start task', text: 'start text', isAvailable: false},
  {id: 'complete', label: 'Mark complete', text: 'complete text', isAvailable: true},
  {id: 'delete', label: 'Delete task', text: 'delete text', isAvailable: true}
];

const WORKSPACE_PROMPTS: readonly TestPrompt<'list' | 'create'>[] = [
  {id: 'list', label: 'List tasks', text: 'list text', isAvailable: true},
  {id: 'create', label: 'Create root task', text: 'create text', isAvailable: true}
];

describe('resolveQuickPromptSlotSelection', () => {
  test('maps slot index to display-order prompt id', () => {
    expect(resolveQuickPromptSlotSelection(TASK_PROMPTS, 0)).toBe('view');
    expect(resolveQuickPromptSlotSelection(TASK_PROMPTS, 1)).toBe('add-subtask');
    expect(resolveQuickPromptSlotSelection(TASK_PROMPTS, 3)).toBe('complete');
    expect(resolveQuickPromptSlotSelection(TASK_PROMPTS, 4)).toBe('delete');
    expect(resolveQuickPromptSlotSelection(WORKSPACE_PROMPTS, 1)).toBe('create');
  });

  test('returns undefined when the slot prompt is unavailable', () => {
    expect(resolveQuickPromptSlotSelection(TASK_PROMPTS, 2)).toBeUndefined();
  });

  test('returns undefined for unused slots', () => {
    expect(resolveQuickPromptSlotSelection(WORKSPACE_PROMPTS, 2)).toBeUndefined();
    expect(resolveQuickPromptSlotSelection(WORKSPACE_PROMPTS, 3)).toBeUndefined();
  });
});

describe('resolveActiveQuickPromptText', () => {
  test('returns prompt text for the active selection id', () => {
    expect(resolveActiveQuickPromptText(TASK_PROMPTS, 'view')).toBe('view text');
    expect(resolveActiveQuickPromptText(WORKSPACE_PROMPTS, 'create')).toBe('create text');
  });

  test('returns undefined when the selection id is missing', () => {
    expect(resolveActiveQuickPromptText(TASK_PROMPTS, 'missing' as 'view')).toBeUndefined();
  });

  test('returns empty string when the matched prompt text is empty', () => {
    const prompts = [{id: 'view' as const, text: '', isAvailable: true}];

    expect(resolveActiveQuickPromptText(prompts, 'view')).toBe('');
  });
});
