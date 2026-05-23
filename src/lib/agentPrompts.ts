import dedent from 'ts-dedent';

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
  isAvailable: boolean;
};

type AgentPromptDefinition = {
  id: AgentPromptId;
  label: string;
  buildText: (workspaceName: string, taskId: string) => string;
};

/*
 * Constants.
 */

const AGENT_PROMPT_DEFINITIONS: readonly AgentPromptDefinition[] = [
  {id: 'view', label: 'Look at task', buildText: buildViewPrompt},
  {id: 'start', label: 'Start task', buildText: buildStartPrompt},
  {id: 'complete', label: 'Mark complete', buildText: buildCompletePrompt},
  {id: 'delete', label: 'Delete task', buildText: buildDeletePrompt}
];

const visibilityByPromptId: Record<AgentPromptId, (status: TaskStatus) => boolean> = {
  view: () => true,
  start: status => status === 'pending',
  complete: status => status !== 'done',
  delete: () => true
};

/*
 * Helpers.
 */

/** Agent instruction snippets in display order; unavailable prompts stay listed but marked disabled. */
export function buildAgentPrompts(input: {
  workspaceName: string;
  taskId: string;
  status: TaskStatus;
}): readonly AgentPrompt[] {
  const {workspaceName, taskId, status} = input;

  return AGENT_PROMPT_DEFINITIONS.map(definition => ({
    id: definition.id,
    label: definition.label,
    text: definition.buildText(workspaceName, taskId),
    isAvailable: visibilityByPromptId[definition.id](status)
  }));
}

function buildViewPrompt(workspaceName: string, taskId: string): string {
  return agentPromptText`
    View and understand dex task \`${taskId}\` (workspace \`${workspaceName}\`) — read only for now; do not start implementation.
    Run \`gdex ${workspaceName} show ${taskId} --full\`, summarize what the task is asking, and discuss scope or questions with the user.
    Wait for explicit direction before changing code or running \`gdex ${workspaceName} start ${taskId}\`.
  `;
}

function buildStartPrompt(workspaceName: string, taskId: string): string {
  return agentPromptText`
    Kick off dex task \`${taskId}\` (workspace \`${workspaceName}\`).
    Run \`gdex ${workspaceName} start ${taskId}\`, then work through the task with the user.
    When implementation is done, run any self-feedback or validation the project expects (lint, typecheck, etc.).
    Pause for the human to review and commit your changes — do not mark the dex task complete until after that commit.
    Then run \`gdex ${workspaceName} complete ${taskId} --result "..."\` with a concise result summary.
  `;
}

function buildCompletePrompt(workspaceName: string, taskId: string): string {
  return agentPromptText`
    Mark dex task \`${taskId}\` complete (workspace \`${workspaceName}\`).
    When done, run \`gdex ${workspaceName} complete ${taskId} --result "..."\` with a concise result summary.
  `;
}

function buildDeletePrompt(workspaceName: string, taskId: string): string {
  return agentPromptText`
    Delete dex task \`${taskId}\` safely (workspace \`${workspaceName}\`).
    Run \`gdex ${workspaceName} show ${taskId} --full\` first, warn about subtasks if any,
    get user confirmation, then \`gdex ${workspaceName} delete ${taskId}\` (or \`-f\` if appropriate).
  `;
}

/**
 * Single-paragraph agent prompt: `dedent` for authoring, then join lines with spaces for clipboard paste.
 *
 * @example
 * agentPromptText`
 *   Kick off dex task \`oobeapzz\` (workspace \`greg\`).
 *   Run \`gdex greg start oobeapzz\`, then work through the task with the user.
 * `;
 * // => "Kick off dex task `oobeapzz` (workspace `greg`). Run `gdex greg start oobeapzz`, then work through the task with the user."
 */
function agentPromptText(templ: TemplateStringsArray, ...values: unknown[]): string {
  return dedent(templ, ...values).replace(/\n+/g, ' ');
}
