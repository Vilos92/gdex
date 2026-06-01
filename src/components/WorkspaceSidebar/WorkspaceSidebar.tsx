import {useState} from 'preact/hooks';

import {CollapsedWorkspaceSidebarBody} from '@/components/WorkspaceSidebar/CollapsedWorkspaceSidebarBody';
import {ExpandedWorkspaceSidebarBody} from '@/components/WorkspaceSidebar/ExpandedWorkspaceSidebarBody';
import {WorkspaceSidebarHeader} from '@/components/WorkspaceSidebar/WorkspaceSidebarHeader';
import * as styles from '@/components/WorkspaceSidebar/workspaceSidebar.css';
import {useWorkspaceSelection} from '@/hooks/useWorkspaceSelection';

/*
 * Component.
 */

export function WorkspaceSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const {workspaces, activeWorkspaceId, isWorkspaceSwitching, selectError, selectWorkspace} =
    useWorkspaceSelection();

  const toggleCollapsed = () => setIsCollapsed(collapsed => !collapsed);

  const openAddWorkspace = () => {
    setIsAddFormOpen(true);
    setIsCollapsed(false);
  };

  const asideClass = isCollapsed ? styles.sidebarCollapsed : styles.sidebar;

  return (
    <aside class={asideClass} aria-label="Workspaces">
      <WorkspaceSidebarHeader isCollapsed={isCollapsed} onToggleCollapsed={toggleCollapsed} />
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
