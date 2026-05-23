import {SidebarPanelIcon} from '@/components/icons/SidebarPanelIcon';
import * as styles from '@/components/WorkspaceSidebar/workspaceSidebar.css';

/*
 * Types.
 */

export type WorkspaceSidebarHeaderProps = {
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

export function WorkspaceSidebarHeader({isCollapsed, onToggleCollapsed}: WorkspaceSidebarHeaderProps) {
  return (
    <div class={sidebarHeaderClass(isCollapsed)}>
      {isCollapsed ? undefined : <h1 class={styles.title}>gdex</h1>}
      <button
        type="button"
        class={styles.collapseToggle}
        aria-label={isCollapsed ? 'Expand workspaces sidebar' : 'Collapse workspaces sidebar'}
        aria-expanded={!isCollapsed}
        onClick={onToggleCollapsed}
      >
        <SidebarPanelIcon pointsRight={isCollapsed} />
      </button>
    </div>
  );
}
