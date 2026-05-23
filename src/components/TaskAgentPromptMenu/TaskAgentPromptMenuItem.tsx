import {ClipboardIcon} from '@/components/icons/ClipboardIcon';
import * as styles from '@/components/TaskAgentPromptMenu/taskAgentPromptMenu.css';
import type {AgentPrompt} from '@/lib/agentPrompts';
import {copyTextToClipboard} from '@/lib/clipboard';

/*
 * Types.
 */

export type TaskAgentPromptMenuItemProps = {
  prompt: AgentPrompt;
  onClose: () => void;
};

/*
 * Component.
 */

export function TaskAgentPromptMenuItem({prompt, onClose}: TaskAgentPromptMenuItemProps) {
  const handleClick = () => {
    if (!prompt.isAvailable) {
      return;
    }

    void copyTextToClipboard(prompt.text);
    onClose();
  };

  return (
    <button
      type="button"
      class={styles.menuItem}
      role="menuitem"
      disabled={!prompt.isAvailable}
      title={`Copy "${prompt.label}" prompt`}
      aria-label={`Copy "${prompt.label}" prompt`}
      onClick={handleClick}
    >
      <span class={styles.menuItemLabel}>{prompt.label}</span>
      <span class={styles.menuItemIconWrap} aria-hidden="true">
        <ClipboardIcon />
      </span>
    </button>
  );
}
