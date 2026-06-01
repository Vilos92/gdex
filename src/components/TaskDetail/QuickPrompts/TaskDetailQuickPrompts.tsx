import {useEffect, useState} from 'preact/hooks';

import {AgentPromptCodeBlock} from '@/components/TaskDetail/QuickPrompts/AgentPromptCodeBlock';
import * as styles from '@/components/TaskDetail/QuickPrompts/taskDetailQuickPrompts.css';
import {type AgentPrompt, buildAgentPrompts, DEFAULT_AGENT_PROMPT_ID} from '@/lib/agentPrompts';
import type {TaskStatus} from '@/lib/taskApi';
import type {Workspace} from '@/lib/workspaceApi';
import * as disclosureStyles from '@/styles/panelDisclosure.css';

/*
 * Types.
 */

export type TaskDetailQuickPromptsProps = {
  workspace: Workspace;
  taskId: string;
  status: TaskStatus;
};

/*
 * Component.
 */

export function TaskDetailQuickPrompts({workspace, taskId, status}: TaskDetailQuickPromptsProps) {
  const prompts = buildAgentPrompts({workspace, taskId, status});
  const [selectedId, setSelectedId] = useState<AgentPrompt['id']>(DEFAULT_AGENT_PROMPT_ID);

  useEffect(() => {
    setSelectedId(current => {
      const selected = buildAgentPrompts({workspace, taskId, status}).find(prompt => prompt.id === current);
      return selected?.isAvailable ? current : DEFAULT_AGENT_PROMPT_ID;
    });
  }, [status, workspace, taskId]);

  const activePrompt = prompts.find(prompt => prompt.id === selectedId) ?? prompts[0];
  if (activePrompt === undefined) {
    return undefined;
  }

  return (
    <details class={disclosureStyles.panelDisclosureDetails}>
      <summary class={disclosureStyles.panelDisclosureSummary}>Quick prompts</summary>
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
    </details>
  );
}
