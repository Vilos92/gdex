import {useState} from 'preact/hooks';
import {useShallow} from 'zustand/shallow';

import * as styles from '@/components/workspaceHomePanel.css';
import {invokeErrorMessage} from '@/lib/error';
import type {Workspace} from '@/lib/workspaceApi';
import {useAppStore} from '@/stores/appStore';

/*
 * Types.
 */

export type WorkspaceHomePanelProps = {
  workspace: Workspace;
};

type DeleteConfirmProps = {
  workspaceName: string;
  isDeleting: boolean;
  deleteError: string | undefined;
  onConfirm: () => void;
  onCancel: () => void;
};

/*
 * Component.
 */

export function WorkspaceHomePanel({workspace}: WorkspaceHomePanelProps) {
  const {deleteWorkspace} = useWorkspaceHomePanelState();
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | undefined>(undefined);

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    setDeleteError(undefined);
    try {
      await deleteWorkspace(workspace.id);
      setIsDeleting(false);
      setIsConfirming(false);
      setDeleteError(undefined);
    } catch (error) {
      setDeleteError(invokeErrorMessage(error, 'Could not delete workspace.'));
      setIsDeleting(false);
    }
  };

  return (
    <aside class={styles.panel} aria-label="Workspace details">
      <h2 class={styles.name}>{workspace.name}</h2>

      <section class={styles.section}>
        <h3 class={styles.sectionLabel}>Config path</h3>
        <p class={styles.sectionBody}>{workspace.configPath}</p>
      </section>

      <section class={styles.section}>
        <h3 class={styles.sectionLabel}>Storage path</h3>
        <p class={styles.sectionBody}>{workspace.storagePath}</p>
      </section>

      <div class={styles.actionsSection}>
        {isConfirming ? (
          <DeleteConfirm
            workspaceName={workspace.name}
            isDeleting={isDeleting}
            deleteError={deleteError}
            onConfirm={handleDeleteConfirm}
            onCancel={() => {
              setDeleteError(undefined);
              setIsConfirming(false);
            }}
          />
        ) : (
          <button
            type="button"
            class={styles.deleteButton}
            onClick={() => {
              setDeleteError(undefined);
              setIsConfirming(true);
            }}
          >
            Delete workspace
          </button>
        )}
      </div>
    </aside>
  );
}

function DeleteConfirm({workspaceName, isDeleting, deleteError, onConfirm, onCancel}: DeleteConfirmProps) {
  return (
    <div class={styles.confirmRow}>
      <p class={styles.confirmText}>
        Delete <strong>{workspaceName}</strong>? This removes it from gdex only — your dex data files are not
        affected.
      </p>
      <div class={styles.confirmActions}>
        <button
          type="button"
          class={styles.confirmDeleteButton}
          disabled={isDeleting}
          aria-disabled={isDeleting}
          onClick={onConfirm}
        >
          {isDeleting ? 'Deleting…' : 'Delete'}
        </button>
        <button type="button" class={styles.cancelButton} disabled={isDeleting} onClick={onCancel}>
          Cancel
        </button>
      </div>
      {deleteError !== undefined ? (
        <p class={styles.deleteError} role="alert">
          {deleteError}
        </p>
      ) : undefined}
    </div>
  );
}

/*
 * Hooks.
 */

function useWorkspaceHomePanelState() {
  return useAppStore(useShallow(state => ({deleteWorkspace: state.deleteWorkspace})));
}
