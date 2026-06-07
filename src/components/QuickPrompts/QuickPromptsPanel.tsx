import {useEffect, useRef, useState} from 'preact/hooks';
import {tinykeys} from 'tinykeys';

import {AgentPromptCodeBlock} from '@/components/TaskDetail/QuickPrompts/AgentPromptCodeBlock';
import * as styles from '@/components/TaskDetail/QuickPrompts/taskDetailQuickPrompts.css';
import {useClipboardCopy} from '@/hooks/useClipboardCopy';
import {
  checkShouldHandleQuickPromptShortcut,
  QUICK_PROMPT_KEY_BINDINGS,
  resolveActiveQuickPromptText,
  resolveQuickPromptSlotSelection
} from '@/lib/keyboard/quickPromptShortcuts';
import * as disclosureStyles from '@/styles/panelDisclosure.css';

/*
 * Types.
 */

export type QuickPromptOption<TId extends string> = {
  id: TId;
  label: string;
  text: string;
  isAvailable: boolean;
};

export type QuickPromptsPanelProps<TId extends string> = {
  prompts: readonly QuickPromptOption<TId>[];
  defaultPromptId: TId;
};

/*
 * Component.
 */

export function QuickPromptsPanel<TId extends string>({
  prompts,
  defaultPromptId
}: QuickPromptsPanelProps<TId>) {
  const [selectedId, setSelectedId] = useState<TId>(() =>
    resolveQuickPromptSelection(prompts, defaultPromptId, defaultPromptId)
  );
  const {isCopied, copy} = useClipboardCopy();

  useEffect(() => {
    setSelectedId(prevSelectedId => resolveQuickPromptSelection(prompts, prevSelectedId, defaultPromptId));
  }, [defaultPromptId, prompts]);

  useQuickPromptKeyboard({prompts, selectedId, setSelectedId, copy});

  const activePrompt = prompts.find(prompt => prompt.id === selectedId) ?? prompts[0];
  if (activePrompt === undefined) {
    return undefined;
  }

  return (
    <details class={disclosureStyles.panelDisclosureDetails} open>
      <summary class={disclosureStyles.panelDisclosureSummary}>Quick prompts</summary>
      <div class={styles.quickPromptStack}>
        <select
          class={styles.quickPromptSelect}
          value={selectedId}
          onChange={event => setSelectedId((event.currentTarget as HTMLSelectElement).value as TId)}
          aria-label="Agent prompt"
        >
          {prompts.map(prompt => (
            <option key={prompt.id} value={prompt.id} disabled={!prompt.isAvailable}>
              {prompt.label}
            </option>
          ))}
        </select>
        <AgentPromptCodeBlock
          text={activePrompt.text}
          isCopied={isCopied}
          onCopy={() => void copy(activePrompt.text)}
        />
      </div>
    </details>
  );
}

/*
 * Hooks.
 */

function useQuickPromptKeyboard<TId extends string>({
  prompts,
  selectedId,
  setSelectedId,
  copy
}: {
  prompts: readonly QuickPromptOption<TId>[];
  selectedId: TId;
  setSelectedId: (value: TId | ((previous: TId) => TId)) => void;
  copy: (text: string) => Promise<boolean>;
}): void {
  const promptsRef = useRef(prompts);
  const selectedIdRef = useRef(selectedId);
  const setSelectedIdRef = useRef(setSelectedId);
  const copyRef = useRef(copy);

  promptsRef.current = prompts;
  selectedIdRef.current = selectedId;
  setSelectedIdRef.current = setSelectedId;
  copyRef.current = copy;

  useEffect(() => {
    const handleQuickPromptSlot = (slotIndex: number): void => {
      const nextId = resolveQuickPromptSlotSelection(promptsRef.current, slotIndex);
      if (nextId === undefined) {
        return;
      }

      setSelectedIdRef.current(nextId);
    };

    const handleQuickPromptCopy = (): void => {
      const text = resolveActiveQuickPromptText(promptsRef.current, selectedIdRef.current);
      if (text === undefined) {
        return;
      }

      void copyRef.current(text);
    };

    const handleQuickPromptBinding = (
      event: KeyboardEvent,
      binding: (typeof QUICK_PROMPT_KEY_BINDINGS)[number]
    ): void => {
      if (!checkShouldHandleQuickPromptShortcut(event.target)) {
        return;
      }

      event.preventDefault();

      if ('slotIndex' in binding) {
        handleQuickPromptSlot(binding.slotIndex);
        return;
      }

      handleQuickPromptCopy();
    };

    const keyMap = Object.fromEntries(
      QUICK_PROMPT_KEY_BINDINGS.map(binding => [
        binding.tinykey,
        (event: KeyboardEvent) => handleQuickPromptBinding(event, binding)
      ])
    ) as Record<string, (event: KeyboardEvent) => void>;

    return tinykeys(window, keyMap);
  }, []);
}

/*
 * Helpers.
 */

function checkIsQuickPromptAvailable<TId extends string>(
  prompts: readonly QuickPromptOption<TId>[],
  id: TId
): boolean {
  return prompts.some(prompt => prompt.id === id && prompt.isAvailable);
}

function resolveQuickPromptSelection<TId extends string>(
  prompts: readonly QuickPromptOption<TId>[],
  currentId: TId,
  preferredId: TId
): TId {
  if (checkIsQuickPromptAvailable(prompts, currentId)) {
    return currentId;
  }
  if (checkIsQuickPromptAvailable(prompts, preferredId)) {
    return preferredId;
  }
  return fallbackQuickPromptId(prompts, preferredId);
}

function fallbackQuickPromptId<TId extends string>(
  prompts: readonly QuickPromptOption<TId>[],
  preferredId: TId
): TId {
  const firstAvailable = prompts.find(prompt => prompt.isAvailable);
  if (firstAvailable !== undefined) {
    return firstAvailable.id;
  }
  if (prompts[0] !== undefined) {
    return prompts[0].id;
  }
  return preferredId;
}
