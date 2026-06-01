import {useShallow} from 'zustand/shallow';

import {TaskBoard} from '@/components/TaskBoard/TaskBoard';
import {TaskDetail} from '@/components/TaskDetail/TaskDetail';
import * as taskStyles from '@/components/TaskList/taskList.css';
import {useAppStore} from '@/stores/appStore';
import * as transitionStyles from '@/styles/workspaceTransition.css';
import * as styles from '@/views/views.css';

/*
 * Component.
 */

export function WorkspaceMain() {
  const {
    workspaces,
    activeWorkspaceId,
    tasks,
    isLoading,
    isWorkspaceMainVisible,
    loadErrorMessage,
    zoomParentId,
    selectedTaskId,
    selectTask
  } = useWorkspaceMainState();

  const activeWorkspace = workspaces.find(workspace => workspace.id === activeWorkspaceId);

  if (activeWorkspace === undefined) {
    return <p class={styles.placeholder}>Select a workspace</p>;
  }

  if (loadErrorMessage !== undefined) {
    return (
      <div class={[styles.workspaceMain, transitionStyles.workspaceMain].join(' ')}>
        <p class={taskStyles.taskLoadError} role="alert">
          {loadErrorMessage}
        </p>
      </div>
    );
  }

  return (
    <div class={[styles.workspaceMain, transitionStyles.workspaceMain].join(' ')}>
      {isWorkspaceMainVisible ? (
        <>
          <TaskBoard
            tasks={tasks}
            workspace={activeWorkspace}
            zoomParentId={zoomParentId}
            selectedTaskId={selectedTaskId}
            isLoading={isLoading}
            onSelectTask={selectTask}
          />
          <TaskDetail />
        </>
      ) : undefined}
    </div>
  );
}

/*
 * Hooks.
 */

function useWorkspaceMainState() {
  return useAppStore(
    useShallow(state => ({
      workspaces: state.workspaces,
      activeWorkspaceId: state.activeWorkspaceId,
      tasks: state.tasks,
      isLoading: state.isTasksLoading,
      isWorkspaceMainVisible: state.isWorkspaceMainVisible,
      loadErrorMessage: state.tasksLoadError,
      zoomParentId: state.zoomParentId,
      selectedTaskId: state.selectedTaskId,
      selectTask: state.selectTask
    }))
  );
}
