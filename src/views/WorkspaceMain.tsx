import {useShallow} from 'zustand/shallow';

import {TaskBoard} from '@/components/TaskBoard/TaskBoard';
import {TaskDetail} from '@/components/TaskDetail/TaskDetail';
import * as taskStyles from '@/components/TaskList/taskList.css';
import {useAppStore} from '@/stores/appStore';
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
    loadErrorMessage,
    zoomParentId,
    selectedTaskId,
    selectTask
  } = useWorkspaceMainState();

  const activeWorkspace = workspaces.find(workspace => workspace.id === activeWorkspaceId);

  if (activeWorkspace === undefined) {
    return <p class={styles.placeholder}>Select a workspace</p>;
  }

  if (isLoading) {
    return <p class={taskStyles.emptyMessage}>Loading tasks…</p>;
  }

  if (loadErrorMessage !== undefined) {
    return (
      <p class={taskStyles.taskLoadError} role="alert">
        {loadErrorMessage}
      </p>
    );
  }

  return (
    <div class={styles.workspaceMain}>
      <TaskBoard
        tasks={tasks}
        workspace={activeWorkspace}
        zoomParentId={zoomParentId}
        selectedTaskId={selectedTaskId}
        onSelectTask={selectTask}
      />
      <TaskDetail />
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
      loadErrorMessage: state.tasksLoadError,
      zoomParentId: state.zoomParentId,
      selectedTaskId: state.selectedTaskId,
      selectTask: state.selectTask
    }))
  );
}
