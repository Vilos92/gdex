import {useEffect, useState} from 'preact/hooks';

import {AgentPromptCodeBlock} from '@/components/TaskDetail/QuickPrompts/AgentPromptCodeBlock';
import * as styles from '@/components/TaskDetail/QuickPrompts/taskDetailQuickPrompts.css';
import {type AgentPrompt, buildAgentPrompts, DEFAULT_AGENT_PROMPT_ID} from '@/lib/agentPrompts';
import type {TaskStatus} from '@/lib/taskApi';

/*
 * Types.
 */

export type TaskDetailQuickPromptsProps = {
  workspaceName: string;
  taskId: string;
  status: TaskStatus;
};

/*
 * Component.
 */

export function TaskDetailQuickPrompts({workspaceName, taskId, status}: TaskDetailQuickPromptsProps) {
  const prompts = buildAgentPrompts({workspaceName, taskId, status});
  const [selectedId, setSelectedId] = useState<AgentPrompt['id']>(DEFAULT_AGENT_PROMPT_ID);

  useEffect(() => {
    setSelectedId(DEFAULT_AGENT_PROMPT_ID);
  }, [taskId, workspaceName]);

  useEffect(() => {
    setSelectedId(current => {
      const selected = buildAgentPrompts({workspaceName, taskId, status}).find(
        prompt => prompt.id === current
      );
      return selected?.isAvailable ? current : DEFAULT_AGENT_PROMPT_ID;
    });
  }, [status, workspaceName, taskId]);

  const activePrompt = prompts.find(prompt => prompt.id === selectedId) ?? prompts[0];
  if (activePrompt === undefined) {
    return undefined;
  }

  return (
    <section class={styles.section} aria-label="Quick prompts">
      <h3 class={styles.sectionLabel}>Quick prompts</h3>
      <div class={styles.quickPromptStack}>
        <select
          class={styles.quickPromptSelect}
          value={selectedId}
          onChange={event =>
            setSelectedId((event.currentTarget as HTMLSelectElement).value as AgentPrompt['id'])
          }
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
    </section>
  );
}
