import {useState} from 'preact/hooks';

import {CollapsedWorkspaceSidebarBody} from '@/components/WorkspaceSidebar/CollapsedWorkspaceSidebarBody';
import {ExpandedWorkspaceSidebarBody} from '@/components/WorkspaceSidebar/ExpandedWorkspaceSidebarBody';
import {WorkspaceSidebarHeader} from '@/components/WorkspaceSidebar/WorkspaceSidebarHeader';
import * as styles from '@/components/WorkspaceSidebar/workspaceSidebar.css';
import {useWorkspaceSelection} from '@/hooks/useWorkspaceSelection';
import {useAppStore} from '@/stores/appStore';

/*
 * Component.
 */

export function WorkspaceSidebar() {
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const isCollapsed = useAppStore(state => state.isSidebarCollapsed);
  const toggleSidebarCollapsed = useAppStore(state => state.toggleSidebarCollapsed);
  const {workspaces, activeWorkspaceId, isWorkspaceSwitching, selectError, selectWorkspace} =
    useWorkspaceSelection();

  const openAddWorkspace = () => {
    setIsAddFormOpen(true);
    if (isCollapsed) {
      toggleSidebarCollapsed();
    }
  };

  const asideClass = isCollapsed ? styles.sidebarCollapsed : styles.sidebar;

  return (
    <aside class={asideClass} data-workspace-sidebar aria-label="Workspaces">
      <WorkspaceSidebarHeader isCollapsed={isCollapsed} onToggleCollapsed={toggleSidebarCollapsed} />
      {isCollapsed ? (
        <CollapsedWorkspaceSidebarBody
          workspaces={workspaces}
          activeWorkspaceId={activeWorkspaceId}
          isWorkspaceSwitching={isWorkspaceSwitching}
          selectError={selectError}
          onSelect={selectWorkspace}
          onAddWorkspace={openAddWorkspace}
        />
      ) : (
        <ExpandedWorkspaceSidebarBody
          workspaces={workspaces}
          activeWorkspaceId={activeWorkspaceId}
          isWorkspaceSwitching={isWorkspaceSwitching}
          selectError={selectError}
          isAddFormOpen={isAddFormOpen}
          onAddFormOpenChange={setIsAddFormOpen}
          onSelect={selectWorkspace}
        />
      )}
    </aside>
  );
}
