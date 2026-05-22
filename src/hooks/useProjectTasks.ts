import {listen} from '@tauri-apps/api/event';
import type {RefObject} from 'preact';
import {useCallback, useEffect, useRef, useState} from 'preact/hooks';

import {invokeErrorMessage} from '@/lib/error';
import {getTasks, type Tasks} from '@/lib/taskApi';

/*
 * Types.
 */

type TaskLoadSetters = {
  setTasks: (tasks: Tasks) => void;
  setLoadErrorMessage: (message: string | undefined) => void;
  setIsLoading: (isLoading: boolean) => void;
};

type TaskLoadResult = {ok: true; tasks: Tasks} | {ok: false; error: unknown};

/*
 * Hooks.
 */

export function useProjectTasks(activeProjectId: string | undefined) {
  const [tasks, setTasks] = useState<Tasks>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadErrorMessage, setLoadErrorMessage] = useState<string | undefined>(undefined);
  const loadRequestIdRef = useRef(0);

  const reloadTasks = useCallback(async () => {
    if (activeProjectId === undefined) {
      loadRequestIdRef.current += 1;
      setTasks([]);
      setLoadErrorMessage(undefined);
      setIsLoading(false);
      return;
    }

    const requestId = ++loadRequestIdRef.current;
    await runTaskLoad(activeProjectId, requestId, loadRequestIdRef, {
      setTasks,
      setLoadErrorMessage,
      setIsLoading
    });
  }, [activeProjectId]);

  useEffect(() => {
    reloadTasks();
  }, [reloadTasks]);

  useEffect(() => {
    let disposed = false;
    let unlisten: (() => void) | undefined;

    const subscribe = async () => {
      const stop = await listen<string>('tasks-changed', event => {
        if (event.payload === activeProjectId) {
          reloadTasks();
        }
      });
      if (disposed) {
        stop();
        return;
      }
      unlisten = stop;
    };

    subscribe().catch(error => {
      console.error('tasks-changed listener failed', error);
    });

    return () => {
      disposed = true;
      unlisten?.();
    };
  }, [activeProjectId, reloadTasks]);

  return {tasks, isLoading, loadErrorMessage, reloadTasks};
}

/*
 * Helpers.
 */

function checkIsCurrentLoadRequest(requestId: number, requestIdRef: RefObject<number>): boolean {
  return requestId === requestIdRef.current;
}

async function loadTasksSafe(projectId: string): Promise<TaskLoadResult> {
  try {
    const tasks = await getTasks(projectId);
    return {ok: true, tasks};
  } catch (error) {
    return {ok: false, error};
  }
}

async function runTaskLoad(
  projectId: string,
  requestId: number,
  requestIdRef: RefObject<number>,
  setters: TaskLoadSetters
): Promise<void> {
  setters.setIsLoading(true);
  setters.setLoadErrorMessage(undefined);

  const loadResult = await loadTasksSafe(projectId);
  if (!checkIsCurrentLoadRequest(requestId, requestIdRef)) {
    return;
  }

  if (loadResult.ok) {
    setters.setTasks(loadResult.tasks);
  } else {
    console.error('get_tasks failed', loadResult.error);
    setters.setLoadErrorMessage(invokeErrorMessage(loadResult.error, 'Could not load tasks.'));
    setters.setTasks([]);
  }

  if (checkIsCurrentLoadRequest(requestId, requestIdRef)) {
    setters.setIsLoading(false);
  }
}
