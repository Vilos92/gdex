/*
 * Constants.
 */

const TASK_BOARD_WIDTH_CSS_VAR = '--task-board-width';

/** Starting width: enough for task titles without crowding the detail pane (13rem at 16px root). */
export const TASK_BOARD_WIDTH_DEFAULT_PX = 208;

/** Floor so the list stays usable before container-compact layout kicks in (~7rem). */
const TASK_BOARD_WIDTH_MIN_PX = 112;

/** Minimum space reserved for the detail column when clamping. */
const TASK_DETAIL_MIN_PX = 384;

/*
 * Helpers.
 */

function formatTaskBoardWidthPx(widthPx: number): string {
  return `${widthPx}px`;
}

export function clampTaskBoardWidthPx(widthPx: number, maxWidthPx: number): number {
  const max = Math.max(TASK_BOARD_WIDTH_MIN_PX, maxWidthPx);
  return Math.min(Math.max(widthPx, TASK_BOARD_WIDTH_MIN_PX), max);
}

export function maxTaskBoardWidthPx(containerWidthPx: number): number {
  const resizerColumnPx = 12;
  const columnGapPx = 16;
  return clampTaskBoardWidthPx(
    containerWidthPx - TASK_DETAIL_MIN_PX - resizerColumnPx - columnGapPx,
    Number.POSITIVE_INFINITY
  );
}

export function applyTaskBoardWidthToElement(element: HTMLElement, widthPx: number): void {
  element.style.setProperty(TASK_BOARD_WIDTH_CSS_VAR, formatTaskBoardWidthPx(widthPx));
}

export function readTaskBoardWidthFromElement(element: HTMLElement): number {
  const raw = getComputedStyle(element).getPropertyValue(TASK_BOARD_WIDTH_CSS_VAR).trim();
  const parsed = parseCssLengthPx(raw);
  return parsed ?? TASK_BOARD_WIDTH_DEFAULT_PX;
}

function parseCssLengthPx(raw: string): number | undefined {
  const trimmed = raw.trim();
  if (trimmed.endsWith('px')) {
    return parsePixelLength(trimmed.slice(0, -2));
  }
  if (trimmed.endsWith('rem')) {
    return parseRemLength(trimmed.slice(0, -3));
  }
  return undefined;
}

function parsePixelLength(raw: string): number | undefined {
  const value = Number.parseFloat(raw);
  return Number.isFinite(value) ? Math.round(value) : undefined;
}

function parseRemLength(raw: string): number | undefined {
  const rem = Number.parseFloat(raw);
  if (!Number.isFinite(rem)) {
    return undefined;
  }
  const rootPx = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
  const pxPerRem = Number.isFinite(rootPx) ? rootPx : 16;
  return Math.round(rem * pxPerRem);
}
