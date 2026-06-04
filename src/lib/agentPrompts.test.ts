import {describe, expect, test} from 'vitest';

import {
  buildAgentPrompts,
  buildWorkspaceAgentPrompts,
  DEFAULT_WORKSPACE_AGENT_PROMPT_ID
} from '@/lib/agentPrompts';
import type {Workspace} from '@/lib/workspaceApi';

/*
 * Constants.
 */

const sampleWorkspace: Workspace = {
  id: 'ws-1',
  name: 'greg',
  configPath: '/tmp/greg/config.toml',
  storagePath: '/tmp/greg/task-db.jsonl'
};

const sampleTaskId = 'abc123xy';

/*
 * Tests.
 */

describe('buildWorkspaceAgentPrompts', () => {
  test('includes list and create prompts with dex CLI paths', () => {
    const prompts = buildWorkspaceAgentPrompts(sampleWorkspace);
    const ids = prompts.map(prompt => prompt.id);

    expect(ids).toEqual(['list', 'create']);
    expect(prompts.every(prompt => prompt.isAvailable)).toBe(true);

    const listPrompt = prompts.find(prompt => prompt.id === 'list');
    const createPrompt = prompts.find(prompt => prompt.id === 'create');

    expect(listPrompt?.text).toContain("dex --config '/tmp/greg/config.toml'");
    expect(listPrompt?.text).toContain("--storage-path '/tmp/greg/task-db.jsonl'");
    expect(listPrompt?.text).toContain('list');

    expect(createPrompt?.text).toContain('create');
    expect(createPrompt?.text).toContain('TASK_TITLE');
    expect(createPrompt?.text).toContain('show <new-id> --full');
  });

  test('defaults to list prompt id constant', () => {
    expect(DEFAULT_WORKSPACE_AGENT_PROMPT_ID).toBe('list');
  });
});

describe('buildAgentPrompts', () => {
  test('complete prompt reminds human to review and commit before complete', () => {
    const prompts = buildAgentPrompts({
      workspace: sampleWorkspace,
      taskId: sampleTaskId,
      status: 'in_progress'
    });
    const completePrompt = prompts.find(prompt => prompt.id === 'complete');

    expect(completePrompt?.text).toContain('ready for review');
    expect(completePrompt?.text).toContain('remind them to commit');
    expect(completePrompt?.text).toContain('explicit approval');
    expect(completePrompt?.text).toContain(`complete '${sampleTaskId}'`);
  });
});
