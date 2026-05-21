import {useState} from 'preact/hooks';

import {pickConfigFile, pickStorageDirectory} from '@/lib/paths';
import type {Project} from '@/lib/projectApi';
import {applyRegistrationResult, submitProjectRegistration} from '@/lib/registerProject';

/*
 * Hooks.
 */

/**
 * Form state and handlers for registering a dex project (name, config file, storage directory).
 * Submit invokes the Tauri `add_project` command (Rust project store).
 * On success the form resets and `onRegistered` runs.
 *
 * @param onRegistered — invoked with the persisted project after a successful registration
 */
export function useProjectRegistration(onRegistered: (project: Project) => void | Promise<void>) {
  const [name, setName] = useState('');
  const [configPath, setConfigPath] = useState<string | undefined>(undefined);
  const [storagePath, setStoragePath] = useState<string | undefined>(undefined);
  const [isRegistering, setIsRegistering] = useState(false);
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
      const pickedStoragePath = await pickStorageDirectory();
      if (pickedStoragePath !== undefined) {
        setStoragePath(pickedStoragePath);
      }
    } catch (error) {
      console.error('pickStorageDirectory failed', error);
      setErrorMessage('Could not open the storage directory picker.');
    }
  };

  const submitRegistration = async () => {
    setIsRegistering(true);
    setErrorMessage(undefined);
    try {
      await applyRegistrationResult(await submitProjectRegistration(buildRegistrationInput()), {
        setName,
        setConfigPath,
        setStoragePath,
        setErrorMessage,
        onRegistered
      });
    } finally {
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
