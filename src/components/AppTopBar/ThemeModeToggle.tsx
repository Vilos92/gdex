import * as styles from '@/components/AppTopBar/appTopBar.css';
import {ThemeModeIcon} from '@/components/ThemeModeIcon/ThemeModeIcon';
import {themeToggleAriaLabel} from '@/lib/theme';
import type {ThemeMode} from '@/schemas/theme';

/*
 * Types.
 */

export type ThemeModeToggleProps = {
  mode: ThemeMode;
  onCycle: () => void;
};

/*
 * Component.
 */

export function ThemeModeToggle({mode, onCycle}: ThemeModeToggleProps) {
  return (
    <button
      type="button"
      class={styles.themeToggle}
      aria-label={themeToggleAriaLabel(mode)}
      onClick={onCycle}
    >
      <ThemeModeIcon mode={mode} />
    </button>
  );
}
