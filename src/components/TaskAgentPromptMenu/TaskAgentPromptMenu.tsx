import {useEffect, useRef} from 'preact/hooks';

import {TaskAgentPromptMenuItem} from '@/components/TaskAgentPromptMenu/TaskAgentPromptMenuItem';
import * as styles from '@/components/TaskAgentPromptMenu/taskAgentPromptMenu.css';
import {buildAgentPrompts} from '@/lib/agentPrompts';
import {type Task, taskStatus} from '@/lib/taskApi';

/*
 * Types.
 */

export type TaskAgentPromptMenuProps = {
  workspaceName: string;
  task: Task;
  position: {x: number; y: number};
  onClose: () => void;
};

/*
 * Component.
 */

export function TaskAgentPromptMenu({workspaceName, task, position, onClose}: TaskAgentPromptMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const prompts = buildAgentPrompts({
    workspaceName,
    taskId: task.id,
    status: taskStatus(task)
  });
  const {x, y} = clampMenuPosition(position.x, position.y);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Node && menuRef.current?.contains(target)) {
        return;
      }
      onClose();
    };

    const handleDismiss = () => {
      onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('scroll', handleDismiss, true);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('scroll', handleDismiss, true);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      class={styles.menu}
      style={{left: `${x}px`, top: `${y}px`}}
      role="menu"
      aria-label="Quick prompts"
      onContextMenu={event => event.preventDefault()}
    >
      <p class={styles.menuHeader}>Quick prompts</p>
      {prompts.map(prompt => (
        <TaskAgentPromptMenuItem key={prompt.id} prompt={prompt} onClose={onClose} />
      ))}
    </div>
  );
}

/*
 * Helpers.
 */

function clampMenuPosition(x: number, y: number): {x: number; y: number} {
  const margin = 8;
  const estimatedWidth = 172;
  const estimatedHeight = 210;
  const maxX = Math.max(margin, window.innerWidth - estimatedWidth - margin);
  const maxY = Math.max(margin, window.innerHeight - estimatedHeight - margin);

  return {
    x: Math.min(Math.max(margin, x), maxX),
    y: Math.min(Math.max(margin, y), maxY)
  };
}
