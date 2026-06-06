import {QuickPromptsPanel} from '@/components/QuickPrompts/QuickPromptsPanel';
import {buildAgentPrompts, DEFAULT_AGENT_PROMPT_ID} from '@/lib/agentPrompts';
import type {TaskStatus} from '@/lib/taskApi';
import type {Workspace} from '@/lib/workspaceApi';

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

  return <QuickPromptsPanel prompts={prompts} defaultPromptId={DEFAULT_AGENT_PROMPT_ID} />;
}
