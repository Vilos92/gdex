import {useEffect, useState} from 'preact/hooks';

import {AgentPromptCodeBlock} from '@/components/TaskDetail/QuickPrompts/AgentPromptCodeBlock';
import * as styles from '@/components/TaskDetail/QuickPrompts/taskDetailQuickPrompts.css';
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
  isInitiallyOpen?: boolean;
};

/*
 * Component.
 */

export function QuickPromptsPanel<TId extends string>({
  prompts,
  defaultPromptId,
  isInitiallyOpen = false
}: QuickPromptsPanelProps<TId>) {
  const [selectedId, setSelectedId] = useState<TId>(() =>
    resolveQuickPromptSelection(prompts, defaultPromptId, defaultPromptId)
  );

  useEffect(() => {
    setSelectedId(current => resolveQuickPromptSelection(prompts, current, defaultPromptId));
  }, [defaultPromptId, prompts]);

  const activePrompt = prompts.find(prompt => prompt.id === selectedId) ?? prompts[0];
  if (activePrompt === undefined) {
    return undefined;
  }

  return (
    <details class={disclosureStyles.panelDisclosureDetails} open={isInitiallyOpen || undefined}>
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
        <AgentPromptCodeBlock text={activePrompt.text} />
      </div>
    </details>
  );
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
