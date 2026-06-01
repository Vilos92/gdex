import {useState} from 'preact/hooks';
import {useShallow} from 'zustand/shallow';

import {invokeErrorMessage} from '@/lib/error';
import type {Workspaces} from '@/schemas/workspace';
import {useAppStore} from '@/stores/appStore';

/*
 * Types.
 */

export type UseWorkspaceSelectionReturn = {
  workspaces: Workspaces;
  activeWorkspaceId: string | undefined;
  isWorkspaceSwitching: boolean;
  selectError: string | undefined;
  selectWorkspace: (workspaceId: string) => Promise<void>;
};

/*
 * Hooks.
 */

export function useWorkspaceSelection(): UseWorkspaceSelectionReturn {
  const [selectError, setSelectError] = useState<string | undefined>(undefined);
  const {workspaces, activeWorkspaceId, isWorkspaceSwitching, switchWorkspace} = useAppStore(
    useShallow(state => ({
      workspaces: state.workspaces,
      activeWorkspaceId: state.activeWorkspaceId,
      isWorkspaceSwitching: state.isTasksLoading && !state.isWorkspaceMainVisible,
      switchWorkspace: state.switchWorkspace
    }))
  );

  const selectWorkspace = async (workspaceId: string) => {
    setSelectError(undefined);
    if (isWorkspaceSwitching) {
      return;
    }
    if (workspaceId === activeWorkspaceId) {
      return;
    }
    try {
      await switchWorkspace(workspaceId);
    } catch (error) {
      setSelectError(invokeErrorMessage(error, 'Could not set active workspace.'));
    }
  };

  return {workspaces, activeWorkspaceId, isWorkspaceSwitching, selectError, selectWorkspace};
}
