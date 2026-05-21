import {invokeErrorMessage} from '@/lib/error';
import {addProject, type Project} from '@/lib/projectApi';

/*
 * Types.
 */

export type RegisterProjectInput = {
  name: string;
  configPath: string;
  storagePath: string;
};

export type RegisterProjectResult = {ok: true; project: Project} | {ok: false; message: string};

export type RegistrationCallbacks = {
  setName: (name: string) => void;
  setConfigPath: (path: string | undefined) => void;
  setStoragePath: (path: string | undefined) => void;
  setErrorMessage: (message: string | undefined) => void;
  onRegistered: (project: Project) => void | Promise<void>;
};

/*
 * Helpers.
 */

export async function submitProjectRegistration(
  input: RegisterProjectInput | undefined
): Promise<RegisterProjectResult> {
  if (input === undefined) {
    return {ok: false, message: 'Select config and storage paths before registering.'};
  }

  try {
    const project = await addProject(input.name, input.configPath, input.storagePath);
    return {ok: true, project};
  } catch (registerError) {
    console.error('add_project failed', registerError);
    return {
      ok: false,
      message: invokeErrorMessage(registerError, 'Could not register project.')
    };
  }
}

export async function applyRegistrationResult(
  result: RegisterProjectResult,
  callbacks: RegistrationCallbacks
): Promise<void> {
  if (!result.ok) {
    callbacks.setErrorMessage(result.message);
    return;
  }

  callbacks.setName('');
  callbacks.setConfigPath(undefined);
  callbacks.setStoragePath(undefined);
  await callbacks.onRegistered(result.project);
}
