import {useState} from 'preact/hooks';

/*
 * Hooks.
 */

export function useFormOpenState(isOpenProp?: boolean, onOpenChange?: (open: boolean) => void) {
  const [isOpenInternal, setIsOpenInternal] = useState(false);
  const hasOpenProp = isOpenProp !== undefined;
  const hasChangeHandler = onOpenChange !== undefined;

  if (hasOpenProp !== hasChangeHandler) {
    throw new Error(
      'useFormOpenState: pass both isOpen and onOpenChange for controlled mode, or neither for uncontrolled mode.'
    );
  }

  if (hasOpenProp && hasChangeHandler) {
    return {isOpen: isOpenProp, setIsOpen: onOpenChange};
  }

  return {isOpen: isOpenInternal, setIsOpen: setIsOpenInternal};
}
