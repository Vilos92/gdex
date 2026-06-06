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
  if (action === 'toggleSidebar') {
    runToggleSidebar(context);
    return;
  }

  if (action === 'cycleTheme') {
    runCycleTheme(context);
    return;
  }

  runWorkspaceCycle(action, context);
}

function runToggleSidebar(context: ChromeShortcutContext): void {
  context.toggleSidebarCollapsed();
}

function runWorkspaceCycle(
  action: Extract<ChromeKeyAction, 'nextWorkspace' | 'prevWorkspace'>,
  context: ChromeShortcutContext
): void {
  if (action === 'nextWorkspace') {
    void switchAdjacentWorkspace(context, 'next');
    return;
  }

  void switchAdjacentWorkspace(context, 'prev');
}

function runCycleTheme(context: ChromeShortcutContext): void {
  context.cycleThemeMode().catch(error => {
    console.error('theme update failed', error);
  });
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
