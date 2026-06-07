/*
 * Types.
 */

export type AutoThemeIconProps = {
  class?: string;
};

/*
 * Component.
 */

/** Half-circle glyph for follow-system (auto) theme. */
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
      <path fill="currentColor" d="M8 2.5a5.5 5.5 0 0 0 0 11Z" />
      <circle cx="8" cy="8" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" d="M8 2.5v11" />
    </svg>
  );
}
