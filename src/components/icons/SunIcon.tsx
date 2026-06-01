/*
 * Types.
 */

export type SunIconProps = {
  class?: string;
};

/*
 * Component.
 */

/** Sun glyph for light theme. */
export function SunIcon(props: SunIconProps) {
  const {class: className} = props;

  return (
    <svg
      class={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      display="block"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
        d="M8 1.5v1.25M8 13.25V14.5M1.5 8h1.25M13.25 8H14.5M3.4 3.4l.88.88M11.72 11.72l.88.88M3.4 12.6l.88-.88M11.72 4.28l.88-.88"
      />
    </svg>
  );
}
