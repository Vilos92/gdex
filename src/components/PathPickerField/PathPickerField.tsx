import * as styles from '@/styles/formFields.css';

/*
 * Types.
 */

export type PathPickerFieldProps = {
  label: string;
  path: string | undefined;
  emptyLabel: string;
  /** Stack path preview above the choose button (fits narrow sidebars). */
  isStacked?: boolean;
  onPick: () => void | Promise<void>;
};

/*
 * Styles.
 */

function pathValueClass(path: string | undefined): string {
  return [styles.pathValue, path !== undefined ? styles.pathValueSet : ''].filter(Boolean).join(' ');
}

function pathRowClass(isStacked: boolean): string {
  return isStacked ? styles.pathRowStacked : styles.pathRow;
}

/*
 * Component.
 */

export function PathPickerField({label, path, emptyLabel, isStacked = false, onPick}: PathPickerFieldProps) {
  return (
    <div class={styles.field}>
      <span class={styles.label}>{label}</span>
      <div class={pathRowClass(isStacked)}>
        <span class={pathValueClass(path)} title={path}>
          {path ?? emptyLabel}
        </span>
        <button
          type="button"
          class={isStacked ? styles.pathChooseButton : undefined}
          onClick={() => onPick()}
        >
          Choose…
        </button>
      </div>
    </div>
  );
}
