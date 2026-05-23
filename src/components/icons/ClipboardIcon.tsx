/*
 * Component.
 */

/** Clipboard outline (clip + board; stroke aligned with `CheckIcon`). */
export function ClipboardIcon({class: className}: {class?: string}) {
  return (
    <svg
      class={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5.5 2.25h5a.75.75 0 0 1 .75.75V4.25H4.75V3a.75.75 0 0 1 .75-.75h.25z" />
        <path d="M4.25 5h7.5a.75.75 0 0 1 .75.75v6.75a.75.75 0 0 1-.75.75h-7.5a.75.75 0 0 1-.75-.75V5.75A.75.75 0 0 1 4.25 5z" />
      </g>
    </svg>
  );
}
