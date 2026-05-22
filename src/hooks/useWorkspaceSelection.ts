import {useState} from 'preact/hooks';
import {useShallow} from 'zustand/shallow';

import {invokeErrorMessage} from '@/lib/error';
import {setActiveWorkspace} from '@/lib/workspaceApi';
import {useAppStore} from '@/stores/appStore';

/*
 * Hooks.
 */

export function useWorkspaceSelection() {
  const [selectError, setSelectError] = useState<string | undefined>(undefined);
  const {workspaces, activeWorkspaceId, setActiveWorkspaceId} = useAppStore(
    useShallow(state => ({
      workspaces: state.workspaces,
      activeWorkspaceId: state.activeWorkspaceId,
      setActiveWorkspaceId: state.setActiveWorkspaceId
    }))
  );

  const selectWorkspace = async (workspaceId: string) => {
    setSelectError(undefined);
    if (workspaceId === activeWorkspaceId) {
      return;
    }
    try {
      await setActiveWorkspace(workspaceId);
      setActiveWorkspaceId(workspaceId);
    } catch (error) {
      console.error('set_active_workspace failed', error);
      setSelectError(invokeErrorMessage(error, 'Could not set active workspace.'));
    }
  };

  return {workspaces, activeWorkspaceId, selectError, selectWorkspace};
}
