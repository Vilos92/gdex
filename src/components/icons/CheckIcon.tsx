/*
 * Types.
 */

export type CheckIconProps = {
  class?: string;
};

/*
 * Component.
 */

/** Simple checkmark for brief copy-success feedback. */
export function CheckIcon(props: CheckIconProps) {
  const {class: className} = props;

  return (
    <svg
      class={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M3.5 8.5 6.5 11.5 12.5 4.5"
      />
    </svg>
  );
}
