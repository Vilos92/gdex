import {listen} from '@tauri-apps/api/event';
import {useCallback, useEffect, useState} from 'preact/hooks';

import {invokeErrorMessage} from '@/lib/error';
import {getTasks, type Tasks} from '@/lib/taskApi';

/*
 * Hooks.
 */

export function useProjectTasks(activeProjectId: string | undefined) {
  const [tasks, setTasks] = useState<Tasks>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadErrorMessage, setLoadErrorMessage] = useState<string | undefined>(undefined);

  const reloadTasks = useCallback(async () => {
    if (activeProjectId === undefined) {
      setTasks([]);
      setLoadErrorMessage(undefined);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setLoadErrorMessage(undefined);
    try {
      const loadedTasks = await getTasks(activeProjectId);
      setTasks(loadedTasks);
    } catch (error) {
      console.error('get_tasks failed', error);
      setLoadErrorMessage(invokeErrorMessage(error, 'Could not load tasks.'));
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  }, [activeProjectId]);

  useEffect(() => {
    reloadTasks();
  }, [reloadTasks]);

  useEffect(() => {
    let unlisten: (() => void) | undefined;

    const subscribe = async () => {
      unlisten = await listen<string>('tasks-changed', event => {
        if (event.payload === activeProjectId) {
          reloadTasks();
        }
      });
    };

    subscribe().catch(error => {
      console.error('tasks-changed listener failed', error);
    });

    return () => {
      unlisten?.();
    };
  }, [activeProjectId, reloadTasks]);

  return {tasks, isLoading, loadErrorMessage, reloadTasks};
}
