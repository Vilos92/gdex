/*
 * Types.
 */

export type AutoThemeIconProps = {
  class?: string;
};

/*
 * Component.
 */

/** Sun-with-rays glyph for follow-system (auto) theme. */
export function AutoThemeIcon(props: AutoThemeIconProps) {
  const {class: className} = props;

  return (
    <svg
      class={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      style={{display: 'block'}}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M8 2.5v2M8 11.5v2M2.5 8h2M11.5 8h2M4.6 4.6l1.4 1.4M10 10l1.4 1.4M4.6 11.4 6 10M10 6l1.4-1.4"
      />
      <circle cx="8" cy="8" r="2.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
