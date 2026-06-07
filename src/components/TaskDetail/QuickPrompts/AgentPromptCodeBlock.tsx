import {CheckIcon} from '@/components/icons/CheckIcon';
import {ClipboardIcon} from '@/components/icons/ClipboardIcon';
import * as styles from '@/components/TaskDetail/QuickPrompts/taskDetailQuickPrompts.css';

/*
 * Types.
 */

export type AgentPromptCodeBlockProps = {
  text: string;
  isCopied: boolean;
  onCopy: () => void;
};

type QuickPromptCopyButtonProps = {
  isCopied: boolean;
  onCopy: () => void;
};

/*
 * Component.
 */

export function AgentPromptCodeBlock({text, isCopied, onCopy}: AgentPromptCodeBlockProps) {
  return (
    <div class={styles.quickPromptCode}>
      <pre class={styles.quickPromptCodeText}>{text}</pre>
      <div class={styles.quickPromptCodeToolbar}>
        <QuickPromptCopyButton isCopied={isCopied} onCopy={onCopy} />
      </div>
    </div>
  );
}

function QuickPromptCopyButton({isCopied, onCopy}: QuickPromptCopyButtonProps) {
  if (isCopied) {
    return (
      <button
        type="button"
        class={[styles.quickPromptCopyButton, styles.quickPromptCopyButtonCopied].join(' ')}
        onClick={onCopy}
        title="Copied!"
        aria-label="Copied!"
      >
        <CheckIcon />
      </button>
    );
  }

  return (
    <button
      type="button"
      class={styles.quickPromptCopyButton}
      onClick={onCopy}
      title="Copy prompt"
      aria-label="Copy prompt to clipboard"
    >
      <ClipboardIcon />
    </button>
  );
}
