import dedent from 'ts-dedent';

import type {TaskStatus} from '@/lib/taskApi';
import {MAX_TASK_DEPTH} from '@/lib/taskLevel';
import type {Workspace} from '@/lib/workspaceApi';

/*
 * Types.
 */

type AgentPromptId = 'view' | 'add-subtask' | 'start' | 'complete' | 'delete';

export type WorkspaceAgentPromptId = 'list' | 'create';

export const DEFAULT_AGENT_PROMPT_ID = 'view' as const;

export const DEFAULT_WORKSPACE_AGENT_PROMPT_ID = 'list' as const;

export type AgentPrompt = {
  id: 'view' | 'add-subtask' | 'start' | 'complete' | 'delete';
  label: string;
  text: string;
  isAvailable: boolean;
};

export type WorkspaceAgentPrompt = {
  id: WorkspaceAgentPromptId;
  label: string;
  text: string;
  isAvailable: boolean;
};

type AgentPromptDefinition = {
  id: AgentPromptId;
  label: string;
  buildText: (workspace: Workspace, taskId: string) => string;
};

type WorkspaceAgentPromptDefinition = {
  id: WorkspaceAgentPromptId;
  label: string;
  buildText: (workspace: Workspace) => string;
};

/*
 * Constants.
 */

const AGENT_PROMPT_DEFINITIONS: readonly AgentPromptDefinition[] = [
  {id: 'view', label: 'Look at task', buildText: buildViewPrompt},
  {id: 'add-subtask', label: 'Add subtask', buildText: buildAddSubtaskPrompt},
  {id: 'start', label: 'Start task', buildText: buildStartPrompt},
  {id: 'complete', label: 'Mark complete', buildText: buildCompletePrompt},
  {id: 'delete', label: 'Delete task', buildText: buildDeletePrompt}
];

const WORKSPACE_AGENT_PROMPT_DEFINITIONS: readonly WorkspaceAgentPromptDefinition[] = [
  {id: 'list', label: 'List tasks', buildText: buildWorkspaceListPrompt},
  {id: 'create', label: 'Create root task', buildText: buildWorkspaceCreatePrompt}
];

type AgentPromptAvailabilityInput = {
  status: TaskStatus;
  taskDepth: number;
};

const availabilityByPromptId: Record<AgentPromptId, (input: AgentPromptAvailabilityInput) => boolean> = {
  view: () => true,
  'add-subtask': ({taskDepth}) => taskDepth < MAX_TASK_DEPTH,
  start: ({status}) => status === 'pending',
  complete: ({status}) => status !== 'done',
  delete: () => true
};

/*
 * Script.
 */

/** Agent instruction snippets in display order. Unavailable prompts stay listed but marked disabled. */
export function buildAgentPrompts(input: {
  workspace: Workspace;
  taskId: string;
  status: TaskStatus;
  taskDepth: number;
}): readonly AgentPrompt[] {
  const {workspace, taskId, status, taskDepth} = input;
  const availabilityInput: AgentPromptAvailabilityInput = {status, taskDepth};

  return AGENT_PROMPT_DEFINITIONS.map(definition => ({
    id: definition.id,
    label: definition.label,
    text: definition.buildText(workspace, taskId),
    isAvailable: availabilityByPromptId[definition.id](availabilityInput)
  }));
}

/** Workspace-home agent prompts (list, create root task). All available on the root panel. */
export function buildWorkspaceAgentPrompts(workspace: Workspace): readonly WorkspaceAgentPrompt[] {
  return WORKSPACE_AGENT_PROMPT_DEFINITIONS.map(definition => ({
    id: definition.id,
    label: definition.label,
    text: definition.buildText(workspace),
    isAvailable: true
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
    If you just finished implementation: tell the user the work is ready for review, remind them to commit when satisfied, and wait for explicit approval before running complete.
    When the human confirms (and any code is committed), run \`${baseCommand} complete ${id} --result "..."\` with a concise result summary.
  `;
}

function buildWorkspaceListPrompt(workspace: Workspace): string {
  const baseCommand = dexBaseCommand(workspace);

  return agentPromptText`
    Survey dex tasks in workspace \`${workspace.name}\`.
    Run \`${baseCommand} list\` to see the tree; add \`--all\` if completed tasks matter.
    Summarize top-level and in-progress work for the user. Do not create, start, complete, or delete tasks unless asked.
  `;
}

function buildWorkspaceCreatePrompt(workspace: Workspace): string {
  const baseCommand = dexBaseCommand(workspace);
  const titlePlaceholder = quoteCliArg('TASK_TITLE');
  const descriptionPlaceholder = quoteCliArg('TASK_DESCRIPTION');

  return agentPromptText`
    Create a new root-level dex task in workspace \`${workspace.name}\`.
    Agree on title and description with the user first, then run \`${baseCommand} create ${titlePlaceholder} --description ${descriptionPlaceholder}\` (replace placeholders with the agreed values).
    Run \`${baseCommand} show <new-id> --full\` to confirm creation and share the new task ID. Do not start or complete the task unless the user asks.
  `;
}

function buildAddSubtaskPrompt(workspace: Workspace, taskId: string): string {
  const baseCommand = dexBaseCommand(workspace);
  const parentId = quoteCliArg(taskId);
  const titlePlaceholder = quoteCliArg('TASK_TITLE');
  const descriptionPlaceholder = quoteCliArg('TASK_DESCRIPTION');

  return agentPromptText`
    Create a new subtask under dex task \`${taskId}\` in workspace \`${workspace.name}\`.
    Agree on title and description with the user first, then run \`${baseCommand} create ${titlePlaceholder} --description ${descriptionPlaceholder} --parent ${parentId}\` (replace placeholders with the agreed values).
    Run \`${baseCommand} show <new-id> --full\` to confirm creation and share the new task ID. Do not start or complete the new subtask unless the user asks.
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
