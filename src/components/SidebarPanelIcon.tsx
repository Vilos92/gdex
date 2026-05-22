/*
 * Types.
 */

type SidebarPanelIconProps = {
  class?: string;
  /** When true, arrow points right (expand collapsed sidebar). */
  pointsRight?: boolean;
};

/*
 * Component.
 */

/** Panel-with-arrow icon for collapsing/expanding a sidebar (stroke from SVG Repo reference). */
export function SidebarPanelIcon({class: className, pointsRight = false}: SidebarPanelIconProps) {
  return (
    <svg
      class={className}
      width="21"
      height="21"
      viewBox="0 0 21 21"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={pointsRight ? {transform: 'scaleX(-1)'} : undefined}
    >
      <g
        fill="none"
        fillRule="evenodd"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(3 3)"
      >
        <path d="m.5 12.5v-10c0-1.1045695.8954305-2 2-2h10c1.1045695 0 2 .8954305 2 2v10c0 1.1045695-.8954305 2-2 2h-10c-1.1045695 0-2-.8954305-2-2z" />
        <path
          d="m2.5 12.5v-10c0-1.1045695.8954305-2 2-2h-2c-1 0-2 .8954305-2 2v10c0 1.1045695 1 2 2 2h2c-1.1045695 0-2-.8954305-2-2z"
          fill="currentColor"
        />
        <path d="m7.5 10.5-3-3 3-3" />
        <path d="m12.5 7.5h-8" />
      </g>
    </svg>
  );
}
