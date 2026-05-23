import type {TaskStatus} from '@/lib/taskApi';

/*
 * Types.
 */

type AgentPromptId = 'view' | 'start' | 'complete' | 'delete';

export const DEFAULT_AGENT_PROMPT_ID = 'view' as const;

export type AgentPrompt = {
  id: 'view' | 'start' | 'complete' | 'delete';
  label: string;
  text: string;
};

/*
 * Helpers.
 */

/** Agent instruction snippets for the active task, filtered by status. */
export function buildAgentPrompts(input: {
  workspaceName: string;
  taskId: string;
  status: TaskStatus;
}): readonly AgentPrompt[] {
  const {workspaceName, taskId, status} = input;
  const candidates: readonly AgentPrompt[] = [
    {id: 'view', label: 'Look at task', text: buildViewPrompt(workspaceName, taskId)},
    {id: 'start', label: 'Start task', text: buildStartPrompt(workspaceName, taskId)},
    {id: 'complete', label: 'Mark complete', text: buildCompletePrompt(workspaceName, taskId)},
    {id: 'delete', label: 'Delete task', text: buildDeletePrompt(workspaceName, taskId)}
  ];

  return candidates.filter(prompt => visibilityByPromptId[prompt.id](status));
}

const visibilityByPromptId: Record<AgentPromptId, (status: TaskStatus) => boolean> = {
  view: () => true,
  start: status => status === 'pending',
  complete: status => status !== 'done',
  delete: () => true
};

function buildViewPrompt(workspaceName: string, taskId: string): string {
  return [
    `View and understand dex task \`${taskId}\` (workspace \`${workspaceName}\`) — read only for now; do not start implementation.`,
    `Run \`gdex ${workspaceName} show ${taskId} --full\`, summarize what the task is asking, and discuss scope or questions with the user.`,
    `Wait for explicit direction before changing code or running \`gdex ${workspaceName} start ${taskId}\`.`
  ].join(' ');
}

function buildStartPrompt(workspaceName: string, taskId: string): string {
  return [
    `Kick off dex task \`${taskId}\` (workspace \`${workspaceName}\`).`,
    `Run \`gdex ${workspaceName} start ${taskId}\`, then work through the task with the user.`,
    `When implementation is done, run any self-feedback or validation the project expects (lint, typecheck, etc.).`,
    `Pause for the human to review and commit your changes — do not mark the dex task complete until after that commit.`,
    `Then run \`gdex ${workspaceName} complete ${taskId} --result "..."\` with a concise result summary.`
  ].join(' ');
}

function buildCompletePrompt(workspaceName: string, taskId: string): string {
  return [
    `Mark dex task \`${taskId}\` complete (workspace \`${workspaceName}\`).`,
    `When done, run \`gdex ${workspaceName} complete ${taskId} --result "..."\` with a concise result summary.`
  ].join(' ');
}

function buildDeletePrompt(workspaceName: string, taskId: string): string {
  return [
    `Delete dex task \`${taskId}\` safely (workspace \`${workspaceName}\`).`,
    `Run \`gdex ${workspaceName} show ${taskId} --full\` first, warn about subtasks if any,`,
    `get user confirmation, then \`gdex ${workspaceName} delete ${taskId}\` (or \`-f\` if appropriate).`
  ].join(' ');
}
