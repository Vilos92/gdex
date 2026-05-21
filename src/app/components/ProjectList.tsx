import * as styles from '@/app/components/projectSidebar.css';
import type {Projects} from '@/lib/projectApi';

/*
 * Types.
 */

export type ProjectListProps = {
  projects: Projects;
  activeProjectId: string | undefined;
  onSelect: (projectId: string) => void;
};

/*
 * Component.
 */

export function ProjectList({projects, activeProjectId, onSelect}: ProjectListProps) {
  return (
    <ul class={styles.projectList}>
      {projects.map(project => {
        const isActive = project.id === activeProjectId;
        return (
          <li key={project.id}>
            <button
              type="button"
              class={[styles.projectButton, isActive ? styles.projectButtonActive : '']
                .filter(Boolean)
                .join(' ')}
              aria-current={isActive ? 'true' : undefined}
              onClick={() => onSelect(project.id)}
            >
              {project.name}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
