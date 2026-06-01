import {signal} from '@preact/signals';
import type {RefObject} from 'preact';
import {useEffect, useRef} from 'preact/hooks';

import {applyTaskBoardWidthToElement, clampTaskBoardWidthPx, maxTaskBoardWidthPx} from '@/lib/taskBoardWidth';

/*
 * Constants.
 */

const isDragging = signal(false);

/*
 * Hooks.
 */

export function useWorkspaceResizerLayout(
  gridRef: RefObject<HTMLDivElement>,
  committedWidthPx: number,
  onCommitWidth: (widthPx: number) => void
) {
  const maxWidthRef = useRef(0);

  useEffect(() => {
    if (isDragging.value) {
      return;
    }
    const grid = gridRef.current;
    if (grid !== null) {
      applyTaskBoardWidthToElement(grid, committedWidthPx);
    }
  }, [committedWidthPx, gridRef]);

  useEffect(() => {
    const grid = gridRef.current;
    if (grid === null) {
      return;
    }

    const syncMaxAndClamp = () => {
      maxWidthRef.current = maxTaskBoardWidthPx(grid.clientWidth);
      if (isDragging.value) {
        return;
      }
      const clamped = clampTaskBoardWidthPx(committedWidthPx, maxWidthRef.current);
      if (clamped !== committedWidthPx) {
        applyTaskBoardWidthToElement(grid, clamped);
        onCommitWidth(clamped);
      }
    };

    syncMaxAndClamp();
    const observer = new ResizeObserver(syncMaxAndClamp);
    observer.observe(grid);
    return () => observer.disconnect();
  }, [committedWidthPx, gridRef, onCommitWidth]);

  return {maxWidthRef, isDragging};
}
