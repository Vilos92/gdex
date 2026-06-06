import type {ChromeKeyAction} from '@/lib/keyboard/keyBindings';
import {checkShouldHandleChromeShortcut} from '@/lib/keyboard/scope';
import {resolveAdjacentWorkspaceId, type WorkspaceCycleDirection} from '@/lib/keyboard/workspaceCycle';
import type {Workspaces} from '@/schemas/workspace';

/*
 * Types.
 */

export type ChromeShortcutContext = {
  readChromeState: () => ChromeShortcutState;
  toggleSidebarCollapsed: () => void;
  switchWorkspace: (workspaceId: string) => Promise<void>;
  cycleThemeMode: () => Promise<void>;
};

export type ChromeShortcutState = {
  workspaces: Workspaces;
  activeWorkspaceId: string | undefined;
  isWorkspaceSwitching: boolean;
};

/*
 * Helpers.
 */

export function handleChromeShortcut(
  event: KeyboardEvent,
  action: ChromeKeyAction,
  context: ChromeShortcutContext
): void {
  if (!checkShouldHandleChromeShortcut(event.target)) {
    return;
  }

  event.preventDefault();
  runChromeShortcutAction(action, context);
}

function runChromeShortcutAction(action: ChromeKeyAction, context: ChromeShortcutContext): void {
  switch (action) {
    case 'toggleSidebar':
      context.toggleSidebarCollapsed();
      return;
    case 'cycleTheme':
      context.cycleThemeMode().catch(error => {
        console.error('theme update failed', error);
      });
      return;
    case 'nextWorkspace':
      void switchAdjacentWorkspace(context, 'next');
      return;
    case 'prevWorkspace':
      void switchAdjacentWorkspace(context, 'prev');
      return;
    default: {
      const unexpected: never = action;
      throw new Error(`Unhandled chrome shortcut action: ${unexpected}`);
    }
  }
}

async function switchAdjacentWorkspace(
  context: ChromeShortcutContext,
  direction: WorkspaceCycleDirection
): Promise<void> {
  const workspaceId = readSwitchTargetWorkspaceId(context, direction);
  if (workspaceId === undefined) {
    return;
  }

  try {
    await context.switchWorkspace(workspaceId);
  } catch (error) {
    console.error('workspace switch failed', error);
  }
}

function readSwitchTargetWorkspaceId(
  context: ChromeShortcutContext,
  direction: WorkspaceCycleDirection
): string | undefined {
  const {workspaces, activeWorkspaceId, isWorkspaceSwitching} = context.readChromeState();
  if (isWorkspaceSwitching) {
    return undefined;
  }

  const workspaceId = resolveAdjacentWorkspaceId(workspaces, activeWorkspaceId, direction);
  if (workspaceId === undefined || workspaceId === activeWorkspaceId) {
    return undefined;
  }

  return workspaceId;
}
