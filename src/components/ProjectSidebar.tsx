import {useState} from 'preact/hooks';

import {CollapsedProjectSidebarBody} from '@/components/CollapsedProjectSidebarBody';
import {ExpandedProjectSidebarBody} from '@/components/ExpandedProjectSidebarBody';
import {ProjectSidebarHeader} from '@/components/ProjectSidebarHeader';
import * as styles from '@/components/projectSidebar.css';
import {useProjectSelection} from '@/hooks/useProjectSelection';

/*
 * Component.
 */

export function ProjectSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const {projects, activeProjectId, selectError, selectProject} = useProjectSelection();

  const toggleCollapsed = () => setIsCollapsed(collapsed => !collapsed);

  const openAddProject = () => {
    setIsAddFormOpen(true);
    setIsCollapsed(false);
  };

  const asideClass = isCollapsed ? styles.sidebarCollapsed : styles.sidebar;

  return (
    <aside class={asideClass} aria-label="Projects">
      <ProjectSidebarHeader isCollapsed={isCollapsed} onToggleCollapsed={toggleCollapsed} />
      {isCollapsed ? (
        <CollapsedProjectSidebarBody
          projects={projects}
          activeProjectId={activeProjectId}
          selectError={selectError}
          onSelect={selectProject}
          onAddProject={openAddProject}
        />
      ) : (
        <ExpandedProjectSidebarBody
          projects={projects}
          activeProjectId={activeProjectId}
          selectError={selectError}
          isAddFormOpen={isAddFormOpen}
          onAddFormOpenChange={setIsAddFormOpen}
          onSelect={selectProject}
        />
      )}
    </aside>
  );
}
