import {useEffect, useRef} from 'preact/hooks';
import {useShallow} from 'zustand/shallow';

import {TaskBoard} from '@/components/TaskBoard/TaskBoard';
import {TaskDetail} from '@/components/TaskDetail/TaskDetail';
import * as taskStyles from '@/components/TaskList/taskList.css';
import {WorkspaceResizer} from '@/components/WorkspaceResizer/WorkspaceResizer';
import {useTaskListKeyboard} from '@/hooks/useTaskListKeyboard';
import {applyTaskBoardWidthToElement} from '@/lib/taskBoardWidth';
import {useAppStore} from '@/stores/appStore';
import * as transitionStyles from '@/styles/workspaceTransition.css';
import * as styles from '@/views/views.css';

/*
 * Component.
 */

export function WorkspaceMain() {
  const gridRef = useRef<HTMLDivElement>(null);
  const {
    workspaces,
    activeWorkspaceId,
    tasks,
    isLoading,
    isWorkspaceMainVisible,
    loadErrorMessage,
    zoomParentId,
    selectedTaskId,
    selectTask,
    setTaskListNavigation,
    taskBoardWidthPx,
    setTaskBoardWidthPx
  } = useWorkspaceMainState();

  useTaskListKeyboard({
    isEnabled: isWorkspaceMainVisible,
    tasks,
    zoomParentId,
    selectedTaskId,
    onApplyNavigation: setTaskListNavigation
  });

  useEffect(() => {
    const grid = gridRef.current;
    if (grid === null) {
      return;
    }
    applyTaskBoardWidthToElement(grid, taskBoardWidthPx);
  }, [taskBoardWidthPx]);

  const activeWorkspace = workspaces.find(workspace => workspace.id === activeWorkspaceId);

  if (activeWorkspace === undefined) {
    return <p class={styles.placeholder}>Select a workspace</p>;
  }

  if (loadErrorMessage !== undefined) {
    return (
      <div class={[styles.workspaceMain, transitionStyles.workspaceMain].join(' ')}>
        <p class={[taskStyles.taskLoadError, styles.workspaceMainMessage].join(' ')} role="alert">
          {loadErrorMessage}
        </p>
      </div>
    );
  }

  return (
    <div ref={gridRef} class={[styles.workspaceMain, transitionStyles.workspaceMain].join(' ')}>
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
          <WorkspaceResizer
            gridRef={gridRef}
            committedWidthPx={taskBoardWidthPx}
            onCommitWidth={setTaskBoardWidthPx}
          />
          <div id="task-detail" tabIndex={-1} class={styles.workspaceMainDetail}>
            <TaskDetail />
          </div>
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
      selectTask: state.selectTask,
      setTaskListNavigation: state.setTaskListNavigation,
      taskBoardWidthPx: state.taskBoardWidthPx,
      setTaskBoardWidthPx: state.setTaskBoardWidthPx
    }))
  );
}
