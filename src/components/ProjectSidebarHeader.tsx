import * as styles from '@/components/projectSidebar.css';
import {SidebarPanelIcon} from '@/components/SidebarPanelIcon';

/*
 * Types.
 */

export type ProjectSidebarHeaderProps = {
  isCollapsed: boolean;
  onToggleCollapsed: () => void;
};

/*
 * Styles.
 */

function sidebarHeaderClass(isCollapsed: boolean): string {
  return [styles.sidebarHeader, isCollapsed ? styles.sidebarHeaderCollapsed : ''].filter(Boolean).join(' ');
}

/*
 * Component.
 */

export function ProjectSidebarHeader({isCollapsed, onToggleCollapsed}: ProjectSidebarHeaderProps) {
  return (
    <div class={sidebarHeaderClass(isCollapsed)}>
      {isCollapsed ? undefined : <h1 class={styles.title}>gdex</h1>}
      <button
        type="button"
        class={styles.collapseToggle}
        aria-label={isCollapsed ? 'Expand projects sidebar' : 'Collapse projects sidebar'}
        aria-expanded={!isCollapsed}
        onClick={onToggleCollapsed}
      >
        <SidebarPanelIcon pointsRight={isCollapsed} />
      </button>
    </div>
  );
}
