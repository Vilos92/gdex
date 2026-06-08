import {QuickPromptsPanel} from '@/components/QuickPrompts/QuickPromptsPanel';
import {buildAgentPrompts, DEFAULT_AGENT_PROMPT_ID} from '@/lib/agentPrompts';
import type {TaskStatus, Tasks} from '@/lib/taskApi';
import {computeTaskDepth} from '@/lib/taskLevel';
import type {Workspace} from '@/lib/workspaceApi';

/*
 * Types.
 */

export type TaskDetailQuickPromptsProps = {
  workspace: Workspace;
  taskId: string;
  status: TaskStatus;
  tasks: Tasks;
};

/*
 * Component.
 */

export function TaskDetailQuickPrompts({workspace, taskId, status, tasks}: TaskDetailQuickPromptsProps) {
  const taskDepth = computeTaskDepth(tasks, taskId);
  const prompts = buildAgentPrompts({workspace, taskId, status, taskDepth});

  return <QuickPromptsPanel prompts={prompts} defaultPromptId={DEFAULT_AGENT_PROMPT_ID} />;
}
