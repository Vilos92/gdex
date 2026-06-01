import {PathPickerField} from '@/components/PathPickerField/PathPickerField';
import * as styles from '@/components/WorkspaceRegisterForm/workspaceRegisterForm.css';
import {useWorkspaceRegistration} from '@/hooks/useWorkspaceRegistration';
import type {Workspace} from '@/lib/workspaceApi';
import * as formStyles from '@/styles/formFields.css';

/*
 * Types.
 */

type WorkspaceRegisterFormLayout = 'default' | 'sidebar';

export type WorkspaceRegisterFormProps = {
  class?: string;
  layout?: WorkspaceRegisterFormLayout;
  onRegistered: (workspace: Workspace) => void | Promise<void>;
};

/*
 * Styles.
 */

function registerFormClass(layout: WorkspaceRegisterFormLayout, extraClass: string | undefined): string {
  return [styles.form, layout === 'sidebar' ? styles.formSidebar : '', extraClass].filter(Boolean).join(' ');
}

/*
 * Component.
 */

export function WorkspaceRegisterForm({
  class: className,
  layout = 'default',
  onRegistered
}: WorkspaceRegisterFormProps) {
  const registration = useWorkspaceRegistration(onRegistered);
  const isSidebarLayout = layout === 'sidebar';

  return (
    <form
      class={registerFormClass(layout, className)}
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
          class={isSidebarLayout ? styles.nameInput : undefined}
          value={registration.name}
          onInput={event => registration.setName(event.currentTarget.value)}
          placeholder="hello world"
          autoComplete="off"
        />
      </div>

      <PathPickerField
        label="Dex config file"
        path={registration.configPath}
        emptyLabel="No config selected"
        isStacked={isSidebarLayout}
        onPick={registration.selectConfig}
      />

      <PathPickerField
        label="Dex storage directory"
        path={registration.storagePath}
        emptyLabel="No storage directory selected"
        isStacked={isSidebarLayout}
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
