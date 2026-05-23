import type {JSX} from 'preact';
import {useState} from 'preact/hooks';

import {WorkspaceRegisterForm} from '@/components/WorkspaceRegisterForm/WorkspaceRegisterForm';
import * as styles from '@/components/WorkspaceSidebar/workspaceSidebar.css';
import {useFormOpenState} from '@/hooks/useFormOpenState';
import {invokeErrorMessage} from '@/lib/error';
import type {Workspace} from '@/lib/workspaceApi';
import {setActiveWorkspace} from '@/lib/workspaceApi';
import {useAppStore} from '@/stores/appStore';

/*
 * Types.
 */

export type AddWorkspacePanelProps = {
  isFormOpen?: boolean;
  onFormOpenChange?: (open: boolean) => void;
};

/*
 * Component.
 */

export function AddWorkspacePanel({
  isFormOpen: isFormOpenProp,
  onFormOpenChange
}: AddWorkspacePanelProps = {}) {
  const {isOpen: isFormOpen, setIsOpen: setIsFormOpen} = useFormOpenState(isFormOpenProp, onFormOpenChange);
  const [activationError, setActivationError] = useState<string | undefined>(undefined);
  const setWorkspaces = useAppStore(state => state.setWorkspaces);
  const setActiveWorkspaceId = useAppStore(state => state.setActiveWorkspaceId);

  const handleRegistered = (workspace: Workspace) =>
    appendRegisteredWorkspace(workspace, {
      setWorkspaces,
      setActiveWorkspaceId,
      setActivationError,
      closeForm: () => setIsFormOpen(false)
    });

  return (
    <div class={styles.addSection}>
      <button type="button" class={styles.addToggle} onClick={() => setIsFormOpen(!isFormOpen)}>
        {isFormOpen ? 'Cancel' : 'Add workspace'}
      </button>
      {activationError !== undefined ? (
        <p class={styles.selectError} role="alert">
          {activationError}
        </p>
      ) : undefined}
      {renderRegisterForm(isFormOpen, handleRegistered)}
    </div>
  );
}

/*
 * Helpers.
 */

type AppendRegisteredWorkspaceDeps = {
  setWorkspaces: ReturnType<typeof useAppStore.getState>['setWorkspaces'];
  setActiveWorkspaceId: (id: string) => void;
  setActivationError: (message: string | undefined) => void;
  closeForm: () => void;
};

/**
 * Runs after `WorkspaceRegisterForm` succeeds: append the new workspace to the list, then
 * either stop or also activate it.
 *
 * When the app already has an active workspace, we only update `workspaces` and close the
 * form — the user keeps their current selection.
 *
 * When there is no active workspace (typical first workspace), we also call
 * `set_active_workspace` so Rust and the store agree on selection; on failure we remove only
 * the workspace that was just added.
 */
async function appendRegisteredWorkspace(workspace: Workspace, deps: AppendRegisteredWorkspaceDeps) {
  const workspaceId = workspace.id;
  deps.setActivationError(undefined);
  deps.setWorkspaces(workspaces => [...workspaces, workspace]);

  if (useAppStore.getState().activeWorkspaceId !== undefined) {
    deps.closeForm();
    return;
  }

  try {
    await setActiveWorkspace(workspaceId);
  } catch (error) {
    console.error('set_active_workspace failed', error);
    deps.setWorkspaces(workspaces => workspaces.filter(row => row.id !== workspaceId));
    deps.setActivationError(invokeErrorMessage(error, 'Could not set active workspace.'));
    return;
  }
  deps.setActiveWorkspaceId(workspaceId);
  deps.closeForm();
}

function renderRegisterForm(
  isFormOpen: boolean,
  onRegistered: (workspace: Workspace) => void | Promise<void>
): JSX.Element | undefined {
  if (!isFormOpen) {
    return undefined;
  }
  return <WorkspaceRegisterForm onRegistered={onRegistered} />;
}
