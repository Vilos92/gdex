import {useState} from 'preact/hooks';
import {useShallow} from 'zustand/shallow';

import {invokeErrorMessage} from '@/lib/error';
import {useAppStore} from '@/stores/appStore';

/*
 * Hooks.
 */

export function useWorkspaceSelection() {
  const [selectError, setSelectError] = useState<string | undefined>(undefined);
  const {workspaces, activeWorkspaceId, switchWorkspace} = useAppStore(
    useShallow(state => ({
      workspaces: state.workspaces,
      activeWorkspaceId: state.activeWorkspaceId,
      switchWorkspace: state.switchWorkspace
    }))
  );

  const selectWorkspace = async (workspaceId: string) => {
    setSelectError(undefined);
    if (workspaceId === activeWorkspaceId) {
      return;
    }
    try {
      await switchWorkspace(workspaceId);
    } catch (error) {
      setSelectError(invokeErrorMessage(error, 'Could not set active workspace.'));
    }
  };

  return {workspaces, activeWorkspaceId, selectError, selectWorkspace};
}
