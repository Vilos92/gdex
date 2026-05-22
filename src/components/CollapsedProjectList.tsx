import * as styles from '@/components/projectSidebar.css';
import type {Projects} from '@/lib/projectApi';

/*
 * Types.
 */

export type CollapsedProjectListProps = {
  projects: Projects;
  activeProjectId: string | undefined;
  onSelect: (projectId: string) => void;
};

/*
 * Styles.
 */

function projectSquareClass(isActive: boolean): string {
  return [styles.collapsedProjectSquare, isActive ? styles.collapsedProjectSquareActive : '']
    .filter(Boolean)
    .join(' ');
}

/*
 * Component.
 */

export function CollapsedProjectList({projects, activeProjectId, onSelect}: CollapsedProjectListProps) {
  return (
    <ul class={styles.collapsedProjectList}>
      {projects.map(project => {
        const isActive = project.id === activeProjectId;
        const label = projectDisplayLabel(project.name);
        return (
          <li key={project.id}>
            <button
              type="button"
              class={projectSquareClass(isActive)}
              aria-current={isActive ? 'true' : undefined}
              aria-label={label}
              title={label}
              onClick={() => onSelect(project.id)}
            >
              {projectInitial(project.name)}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/*
 * Helpers.
 */

function projectDisplayLabel(name: string): string {
  const trimmed = name.trim();
  return trimmed.length > 0 ? trimmed : projectInitial(name);
}

function projectInitial(name: string): string {
  const trimmed = name.trim();
  if (trimmed.length === 0) {
    return '?';
  }
  const initial = trimmed[0];
  return initial === undefined ? '?' : initial.toLocaleUpperCase();
}
