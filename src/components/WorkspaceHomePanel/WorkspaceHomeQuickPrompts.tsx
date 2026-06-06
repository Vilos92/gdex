import {QuickPromptsPanel} from '@/components/QuickPrompts/QuickPromptsPanel';
import {buildWorkspaceAgentPrompts, DEFAULT_WORKSPACE_AGENT_PROMPT_ID} from '@/lib/agentPrompts';
import type {Workspace} from '@/lib/workspaceApi';

/*
 * Types.
 */

export type WorkspaceHomeQuickPromptsProps = {
  workspace: Workspace;
};

/*
 * Component.
 */

export function WorkspaceHomeQuickPrompts({workspace}: WorkspaceHomeQuickPromptsProps) {
  const prompts = buildWorkspaceAgentPrompts(workspace);

  return (
    <QuickPromptsPanel
      key={workspace.id}
      prompts={prompts}
      defaultPromptId={DEFAULT_WORKSPACE_AGENT_PROMPT_ID}
    />
  );
}
