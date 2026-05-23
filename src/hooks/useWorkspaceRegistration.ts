import {useRef, useState} from 'preact/hooks';

import {pickConfigFile, pickStorageDirectory} from '@/lib/paths';
import {applyRegistrationResult, submitWorkspaceRegistration} from '@/lib/registerWorkspace';
import type {Workspace} from '@/lib/workspaceApi';

/*
 * Hooks.
 */

/**
 * Form state and handlers for registering a dex workspace (name, config file, storage directory).
 * Submit invokes the Tauri `add_workspace` command (Rust workspace store).
 * On success the form resets and `onRegistered` runs.
 *
 * @param onRegistered — invoked with the persisted workspace after a successful registration
 */
export function useWorkspaceRegistration(onRegistered: (workspace: Workspace) => void | Promise<void>) {
  const [name, setName] = useState('');
  const [configPath, setConfigPath] = useState<string | undefined>(undefined);
  const [storagePath, setStoragePath] = useState<string | undefined>(undefined);
  const [isRegistering, setIsRegistering] = useState(false);
  const isRegisteringRef = useRef(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const trimmedName = name.trim();
  const hasSelectedPaths = configPath !== undefined && storagePath !== undefined;
  const canRegister = trimmedName.length > 0 && hasSelectedPaths && !isRegistering;

  const buildRegistrationInput = () => {
    if (!canRegister || configPath === undefined || storagePath === undefined) {
      return undefined;
    }
    return {name: trimmedName, configPath, storagePath};
  };

  const selectConfig = async () => {
    setErrorMessage(undefined);
    try {
      const pickedConfigFile = await pickConfigFile();
      if (pickedConfigFile !== undefined) {
        setConfigPath(pickedConfigFile);
      }
    } catch (error) {
      console.error('pickConfigFile failed', error);
      setErrorMessage('Could not open the config file picker.');
    }
  };

  const selectStorage = async () => {
    setErrorMessage(undefined);
    try {
      const pickedStorageDirectory = await pickStorageDirectory();
      if (pickedStorageDirectory !== undefined) {
        setStoragePath(pickedStorageDirectory);
      }
    } catch (error) {
      console.error('pickStorageDirectory failed', error);
      setErrorMessage('Could not open the storage directory picker.');
    }
  };

  const submitRegistration = async () => {
    if (isRegisteringRef.current) {
      return;
    }
    const input = buildRegistrationInput();
    if (input === undefined) {
      return;
    }
    isRegisteringRef.current = true;
    setIsRegistering(true);
    setErrorMessage(undefined);
    try {
      await applyRegistrationResult(await submitWorkspaceRegistration(input), {
        setName,
        setConfigPath,
        setStoragePath,
        setErrorMessage,
        onRegistered
      });
    } finally {
      isRegisteringRef.current = false;
      setIsRegistering(false);
    }
  };

  return {
    name,
    setName,
    configPath,
    storagePath,
    errorMessage,
    canRegister,
    isRegistering,
    selectConfig,
    selectStorage,
    submitRegistration
  };
}
