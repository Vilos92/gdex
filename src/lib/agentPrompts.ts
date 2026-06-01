import dedent from 'ts-dedent';

import type {TaskStatus} from '@/lib/taskApi';
import type {Workspace} from '@/lib/workspaceApi';

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
  buildText: (workspace: Workspace, taskId: string) => string;
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
 * Script.
 */

/** Agent instruction snippets in display order; unavailable prompts stay listed but marked disabled. */
export function buildAgentPrompts(input: {
  workspace: Workspace;
  taskId: string;
  status: TaskStatus;
}): readonly AgentPrompt[] {
  const {workspace, taskId, status} = input;

  return AGENT_PROMPT_DEFINITIONS.map(definition => ({
    id: definition.id,
    label: definition.label,
    text: definition.buildText(workspace, taskId),
    isAvailable: visibilityByPromptId[definition.id](status)
  }));
}

/*
 * Helpers.
 */

/** Single-quote a value for safe paste into shell commands. */
function quoteCliArg(value: string): string {
  return `'${value.replace(/'/g, "'\\''")}'`;
}

function dexBaseCommand(workspace: Workspace): string {
  const configPath = quoteCliArg(workspace.configPath);
  const storagePath = quoteCliArg(workspace.storagePath);
  return `dex --config ${configPath} --storage-path ${storagePath}`;
}

function buildViewPrompt(workspace: Workspace, taskId: string): string {
  const baseCommand = dexBaseCommand(workspace);
  const id = quoteCliArg(taskId);

  return agentPromptText`
    View and understand dex task \`${taskId}\` (workspace \`${workspace.name}\`) — read only for now; do not start implementation.
    Run \`${baseCommand} show ${id} --full\`, summarize what the task is asking, and discuss scope or questions with the user.
    Wait for explicit direction before changing code or running \`${baseCommand} start ${id}\`.
  `;
}

function buildStartPrompt(workspace: Workspace, taskId: string): string {
  const baseCommand = dexBaseCommand(workspace);
  const id = quoteCliArg(taskId);

  return agentPromptText`
    Kick off dex task \`${taskId}\` (workspace \`${workspace.name}\`).
    Run \`${baseCommand} start ${id}\`, then work through the task with the user.
    When implementation is done, run any self-feedback or validation the project expects (lint, typecheck, etc.).
    Pause for the human to review and commit your changes — do not mark the dex task complete until after that commit.
    Then run \`${baseCommand} complete ${id} --result "..."\` with a concise result summary.
  `;
}

function buildCompletePrompt(workspace: Workspace, taskId: string): string {
  const baseCommand = dexBaseCommand(workspace);
  const id = quoteCliArg(taskId);

  return agentPromptText`
    Mark dex task \`${taskId}\` complete (workspace \`${workspace.name}\`).
    When done, run \`${baseCommand} complete ${id} --result "..."\` with a concise result summary.
  `;
}

function buildDeletePrompt(workspace: Workspace, taskId: string): string {
  const baseCommand = dexBaseCommand(workspace);
  const id = quoteCliArg(taskId);

  return agentPromptText`
    Delete dex task \`${taskId}\` safely (workspace \`${workspace.name}\`).
    Run \`${baseCommand} show ${id} --full\` first, warn about subtasks if any,
    get user confirmation, then \`${baseCommand} delete ${id}\` (or \`-f\` if appropriate).
  `;
}

/**
 * Single-paragraph agent prompt: `dedent` for authoring, then join lines with spaces for clipboard paste.
 *
 * @example
 * agentPromptText`
 *   Kick off dex task \`oobeapzz\` (workspace \`greg\`).
 *   Run \`dex --config ... --storage-path ... start oobeapzz\`, then work through the task with the user.
 * `;
 * // => "Kick off dex task `oobeapzz` (workspace `greg`). Run `dex --config ... --storage-path ... start oobeapzz`, then work through the task with the user."
 */
function agentPromptText(templ: TemplateStringsArray, ...values: unknown[]): string {
  return dedent(templ, ...values).replace(/\n+/g, ' ');
}
