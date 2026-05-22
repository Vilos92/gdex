import {useState} from 'preact/hooks';

/*
 * Hooks.
 */

export function useFormOpenState(isOpenProp?: boolean, onOpenChange?: (open: boolean) => void) {
  const [isOpenInternal, setIsOpenInternal] = useState(false);
  const isOpen = isOpenProp ?? isOpenInternal;
  const setIsOpen = onOpenChange ?? setIsOpenInternal;
  return {isOpen, setIsOpen};
}
