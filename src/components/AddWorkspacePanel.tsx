import type {JSX} from 'preact';
import {useState} from 'preact/hooks';

import {WorkspaceRegisterForm} from '@/components/WorkspaceRegisterForm';
import * as styles from '@/components/workspaceSidebar.css';
import {useFormOpenState} from '@/hooks/useFormOpenState';
import {invokeErrorMessage} from '@/lib/error';
import type {Workspace, Workspaces} from '@/lib/workspaceApi';
import {setActiveWorkspace} from '@/lib/workspaceApi';
import {useAppStore} from '@/stores/appStore';

/*
 * Types.
 */

export type AddWorkspacePanelProps = {
  isFormOpen?: boolean;
  onFormOpenChange?: (open: boolean) => void;
};

/** Store slice and panel callbacks passed from `AddWorkspacePanel` into the register handler. */
type WorkspaceRegisterHandlerDeps = {
  workspaces: Workspaces;
  activeWorkspaceId: string | undefined;
  setWorkspaces: (workspaces: Workspaces) => void;
  setActiveWorkspaceId: (id: string) => void;
  setActivationError: (message: string | undefined) => void;
  closeForm: () => void;
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
  const workspaces = useAppStore(state => state.workspaces);
  const activeWorkspaceId = useAppStore(state => state.activeWorkspaceId);
  const setWorkspaces = useAppStore(state => state.setWorkspaces);
  const setActiveWorkspaceId = useAppStore(state => state.setActiveWorkspaceId);

  const handleRegistered = (workspace: Workspace) =>
    appendRegisteredWorkspace(
      {
        workspaces,
        activeWorkspaceId,
        setWorkspaces,
        setActiveWorkspaceId,
        setActivationError,
        closeForm: () => setIsFormOpen(false)
      },
      workspace
    );

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

/**
 * Runs after `WorkspaceRegisterForm` succeeds: append the new workspace to the list, then
 * either stop or also activate it.
 *
 * When the app already has an active workspace, we only update `workspaces` and close the
 * form — the user keeps their current selection.
 *
 * When there is no active workspace (typical first workspace), we also call
 * `set_active_workspace` so Rust and the store agree on selection; on failure we roll
 * back the list append and set `activationError` on the panel.
 */
async function appendRegisteredWorkspace(deps: WorkspaceRegisterHandlerDeps, workspace: Workspace) {
  const nextWorkspaces = [...deps.workspaces, workspace];
  deps.setActivationError(undefined);
  if (deps.activeWorkspaceId !== undefined) {
    deps.setWorkspaces(nextWorkspaces);
    deps.closeForm();
    return;
  }

  deps.setWorkspaces(nextWorkspaces);
  try {
    await setActiveWorkspace(workspace.id);
  } catch (error) {
    console.error('set_active_workspace failed', error);
    deps.setWorkspaces(deps.workspaces);
    deps.setActivationError(invokeErrorMessage(error, 'Could not set active workspace.'));
    return;
  }
  deps.setActiveWorkspaceId(workspace.id);
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
