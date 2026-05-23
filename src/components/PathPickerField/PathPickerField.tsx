import * as styles from '@/components/WorkspaceRegisterForm/workspaceRegisterForm.css';

/*
 * Types.
 */

export type PathPickerFieldProps = {
  label: string;
  path: string | undefined;
  emptyLabel: string;
  onPick: () => void | Promise<void>;
};

/*
 * Styles.
 */

function pathValueClass(path: string | undefined): string {
  return [styles.pathValue, path !== undefined ? styles.pathValueSet : ''].filter(Boolean).join(' ');
}

/*
 * Component.
 */

export function PathPickerField({label, path, emptyLabel, onPick}: PathPickerFieldProps) {
  return (
    <div class={styles.field}>
      <span class={styles.label}>{label}</span>
      <div class={styles.pathRow}>
        <span class={pathValueClass(path)} title={path}>
          {path ?? emptyLabel}
        </span>
        <button type="button" onClick={() => onPick()}>
          Choose…
        </button>
      </div>
    </div>
  );
}
