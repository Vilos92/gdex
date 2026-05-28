import {PathPickerField} from '@/components/PathPickerField/PathPickerField';
import * as formStyles from '@/styles/formFields.css';
import * as styles from '@/components/WorkspaceRegisterForm/workspaceRegisterForm.css';
import {useWorkspaceRegistration} from '@/hooks/useWorkspaceRegistration';
import type {Workspace} from '@/lib/workspaceApi';

/*
 * Types.
 */

export type WorkspaceRegisterFormProps = {
  class?: string;
  onRegistered: (workspace: Workspace) => void | Promise<void>;
};

/*
 * Styles.
 */

function registerFormClass(extraClass: string | undefined): string {
  return [styles.form, extraClass].filter(Boolean).join(' ');
}

/*
 * Component.
 */

export function WorkspaceRegisterForm({class: className, onRegistered}: WorkspaceRegisterFormProps) {
  const registration = useWorkspaceRegistration(onRegistered);

  return (
    <form
      class={registerFormClass(className)}
      onSubmit={event => {
        event.preventDefault();
        registration.submitRegistration();
      }}
    >
      <div class={formStyles.field}>
        <label class={formStyles.label} for="workspace-name">
          Workspace name
        </label>
        <input
          id="workspace-name"
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
        label="Dex storage directory"
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
        {registration.isRegistering ? 'Registering…' : 'Register workspace'}
      </button>
    </form>
  );
}
