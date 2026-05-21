import {PathPickerField} from '@/components/PathPickerField';
import * as styles from '@/components/projectRegisterForm.css';
import {useProjectRegistration} from '@/hooks/useProjectRegistration';
import type {Project} from '@/lib/projectApi';

/*
 * Types.
 */

export type ProjectRegisterFormProps = {
  class?: string;
  onRegistered: (project: Project) => void | Promise<void>;
};

/*
 * Component.
 */

export function ProjectRegisterForm({class: className, onRegistered}: ProjectRegisterFormProps) {
  const registration = useProjectRegistration(onRegistered);

  return (
    <form
      class={[styles.form, className].filter(Boolean).join(' ')}
      onSubmit={event => {
        event.preventDefault();
        registration.submitRegistration();
      }}
    >
      <div class={styles.field}>
        <label class={styles.label} for="project-name">
          Project name
        </label>
        <input
          id="project-name"
          value={registration.name}
          onInput={event => registration.setName(event.currentTarget.value)}
          placeholder="greg"
          autoComplete="off"
        />
      </div>

      <PathPickerField
        label="Dex config file"
        path={registration.configPath}
        emptyLabel="No config selected"
        onPick={registration.selectConfig}
      />

      <PathPickerField
        label="Task storage directory"
        path={registration.storagePath}
        emptyLabel="No storage directory selected"
        onPick={registration.selectStorage}
      />

      {registration.errorMessage !== undefined ? (
        <p class={styles.error} role="alert">
          {registration.errorMessage}
        </p>
      ) : undefined}

      <button
        type="submit"
        class={styles.submitButton}
        disabled={!registration.canRegister}
        aria-disabled={!registration.canRegister}
      >
        {registration.isRegistering ? 'Registering…' : 'Register project'}
      </button>
    </form>
  );
}
