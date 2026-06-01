import type {JSX, RefObject} from 'preact';
import {useRef} from 'preact/hooks';

import * as styles from '@/components/WorkspaceResizer/workspaceResizer.css';
import {useWorkspaceResizerLayout} from '@/hooks/useWorkspaceResizerLayout';
import {
  applyTaskBoardWidthToElement,
  clampTaskBoardWidthPx,
  readTaskBoardWidthFromElement
} from '@/lib/taskBoardWidth';

/*
 * Types.
 */

export type WorkspaceResizerProps = {
  gridRef: RefObject<HTMLDivElement>;
  committedWidthPx: number;
  onCommitWidth: (widthPx: number) => void;
};

/*
 * Component.
 */

export function WorkspaceResizer({gridRef, committedWidthPx, onCommitWidth}: WorkspaceResizerProps) {
  const dragStartXRef = useRef(0);
  const dragStartWidthRef = useRef(committedWidthPx);
  const {maxWidthRef, isDragging} = useWorkspaceResizerLayout(gridRef, committedWidthPx, onCommitWidth);

  return (
    <div
      class={styles.handle}
      data-dragging={isDragging.value ? 'true' : 'false'}
      onPointerDown={event => beginDrag(event, gridRef, dragStartXRef, dragStartWidthRef, isDragging)}
      onPointerMove={event =>
        moveDrag(event, gridRef, dragStartXRef, dragStartWidthRef, maxWidthRef, isDragging)
      }
      onPointerUp={event => endDrag(event, gridRef, onCommitWidth, isDragging)}
      onPointerCancel={event => endDrag(event, gridRef, onCommitWidth, isDragging)}
    />
  );
}

/*
 * Helpers.
 */

function beginDrag(
  event: JSX.TargetedPointerEvent<HTMLDivElement>,
  gridRef: RefObject<HTMLDivElement>,
  dragStartXRef: {current: number},
  dragStartWidthRef: {current: number},
  isDragging: {value: boolean}
): void {
  if (event.button !== 0) {
    return;
  }
  const grid = gridRef.current;
  if (grid === null) {
    return;
  }
  event.preventDefault();
  event.currentTarget.setPointerCapture(event.pointerId);
  isDragging.value = true;
  dragStartXRef.current = event.clientX;
  dragStartWidthRef.current = readTaskBoardWidthFromElement(grid);
  setDragLock(true);
}

function moveDrag(
  event: JSX.TargetedPointerEvent<HTMLDivElement>,
  gridRef: RefObject<HTMLDivElement>,
  dragStartXRef: {current: number},
  dragStartWidthRef: {current: number},
  maxWidthRef: {current: number},
  isDragging: {value: boolean}
): void {
  if (!isDragging.value) {
    return;
  }
  const grid = gridRef.current;
  if (grid === null) {
    return;
  }
  const delta = event.clientX - dragStartXRef.current;
  const width = clampTaskBoardWidthPx(dragStartWidthRef.current + delta, maxWidthRef.current);
  applyTaskBoardWidthToElement(grid, width);
}

function endDrag(
  event: JSX.TargetedPointerEvent<HTMLDivElement>,
  gridRef: RefObject<HTMLDivElement>,
  onCommitWidth: (widthPx: number) => void,
  isDragging: {value: boolean}
): void {
  if (!isDragging.value) {
    return;
  }
  if (event.currentTarget.hasPointerCapture(event.pointerId)) {
    event.currentTarget.releasePointerCapture(event.pointerId);
  }
  isDragging.value = false;
  setDragLock(false);
  const grid = gridRef.current;
  if (grid === null) {
    return;
  }
  onCommitWidth(readTaskBoardWidthFromElement(grid));
}

function setDragLock(isActive: boolean): void {
  document.body.style.userSelect = isActive ? 'none' : '';
  document.body.style.cursor = isActive ? 'col-resize' : '';
}
