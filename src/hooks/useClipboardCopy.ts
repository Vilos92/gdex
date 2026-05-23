import {useCallback, useEffect, useRef, useState} from 'preact/hooks';

import {copyTextToClipboard} from '@/lib/clipboard';

const COPY_FEEDBACK_MS = 1200;

/*
 * Hooks.
 */

/** Copy text to the clipboard and briefly surface success feedback. */
export function useClipboardCopy() {
  const [isCopied, setIsCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== undefined) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const copy = useCallback(async (text: string) => {
    if (timeoutRef.current !== undefined) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }

    const didCopy = await copyTextToClipboard(text);
    if (didCopy) {
      setIsCopied(true);
      timeoutRef.current = setTimeout(() => {
        setIsCopied(false);
        timeoutRef.current = undefined;
      }, COPY_FEEDBACK_MS);
      return true;
    }

    setIsCopied(false);
    return false;
  }, []);

  return {isCopied, copy};
}
