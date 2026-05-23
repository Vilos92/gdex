import {CheckIcon} from '@/components/icons/CheckIcon';
import {ClipboardIcon} from '@/components/icons/ClipboardIcon';
import * as styles from '@/components/TaskDetail/QuickPrompts/taskDetailQuickPrompts.css';
import {useClipboardCopy} from '@/hooks/useClipboardCopy';

/*
 * Types.
 */

export type AgentPromptCodeBlockProps = {
  text: string;
};

type QuickPromptCopyButtonProps = {
  text: string;
};

/*
 * Component.
 */

export function AgentPromptCodeBlock({text}: AgentPromptCodeBlockProps) {
  return (
    <div class={styles.quickPromptCode}>
      <pre class={styles.quickPromptCodeText}>{text}</pre>
      <div class={styles.quickPromptCodeToolbar}>
        <QuickPromptCopyButton text={text} />
      </div>
    </div>
  );
}

function QuickPromptCopyButton({text}: QuickPromptCopyButtonProps) {
  const {isCopied, copy} = useClipboardCopy();
  const {buttonClass, title, ariaLabel, Icon} = quickPromptCopyPresentation(isCopied);

  return (
    <button
      type="button"
      class={buttonClass}
      onClick={() => void copy(text)}
      title={title}
      aria-label={ariaLabel}
    >
      <Icon />
    </button>
  );
}

/*
 * Helpers.
 */

function quickPromptCopyPresentation(isCopied: boolean) {
  if (isCopied) {
    return {
      buttonClass: `${styles.quickPromptCopyButton} ${styles.quickPromptCopyButtonCopied}`,
      title: 'Copied!',
      ariaLabel: 'Copied!',
      Icon: CheckIcon
    };
  }

  return {
    buttonClass: styles.quickPromptCopyButton,
    title: 'Copy prompt',
    ariaLabel: 'Copy prompt to clipboard',
    Icon: ClipboardIcon
  };
}
