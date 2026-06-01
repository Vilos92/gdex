/*
 * Types.
 */

export type MoonIconProps = {
  class?: string;
};

/*
 * Component.
 */

/** Moon glyph for dark theme. */
export function MoonIcon(props: MoonIconProps) {
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
        d="M8 2.25a4 4 0 0 0 6 6 6 6 0 1 1-6-6Z"
      />
    </svg>
  );
}
