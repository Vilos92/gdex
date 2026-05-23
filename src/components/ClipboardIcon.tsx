/*
 * Component.
 */

/** Clipboard outline icon (stroke style aligned with `SidebarPanelIcon`). */
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
      <g fill="none" fillRule="evenodd" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5.5 2.5h7a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1z" />
        <path d="M3.5 5.5h7a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1z" />
      </g>
    </svg>
  );
}
