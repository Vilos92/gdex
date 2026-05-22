import {invokeErrorMessage} from '@/lib/error';
import {addWorkspace, type Workspace} from '@/lib/workspaceApi';

/*
 * Types.
 */

export type RegisterWorkspaceInput = {
  name: string;
  configPath: string;
  storagePath: string;
};

export type RegisterWorkspaceResult = {ok: true; workspace: Workspace} | {ok: false; message: string};

export type RegistrationCallbacks = {
  setName: (name: string) => void;
  setConfigPath: (path: string | undefined) => void;
  setStoragePath: (path: string | undefined) => void;
  setErrorMessage: (message: string | undefined) => void;
  onRegistered: (workspace: Workspace) => void | Promise<void>;
};

/*
 * Helpers.
 */

export async function submitWorkspaceRegistration(
  input: RegisterWorkspaceInput | undefined
): Promise<RegisterWorkspaceResult> {
  if (input === undefined) {
    return {ok: false, message: 'Select config and storage paths before registering.'};
  }

  try {
    const workspace = await addWorkspace(input.name, input.configPath, input.storagePath);
    return {ok: true, workspace};
  } catch (registerError) {
    console.error('add_workspace failed', registerError);
    return {
      ok: false,
      message: invokeErrorMessage(registerError, 'Could not register workspace.')
    };
  }
}

export async function applyRegistrationResult(
  result: RegisterWorkspaceResult,
  callbacks: RegistrationCallbacks
): Promise<void> {
  if (!result.ok) {
    callbacks.setErrorMessage(result.message);
    return;
  }

  await callbacks.onRegistered(result.workspace);

  callbacks.setName('');
  callbacks.setConfigPath(undefined);
  callbacks.setStoragePath(undefined);
}
