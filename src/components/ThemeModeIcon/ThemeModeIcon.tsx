import {AutoThemeIcon} from '@/components/icons/AutoThemeIcon';
import {MoonIcon} from '@/components/icons/MoonIcon';
import {SunIcon} from '@/components/icons/SunIcon';
import type {ThemeMode} from '@/schemas/theme';

/*
 * Types.
 */

export type ThemeModeIconProps = {
  mode: ThemeMode;
  class?: string;
};

/*
 * Component.
 */

/** Picks the theme-cycle glyph for the current mode (light / dark / auto). */
export function ThemeModeIcon(props: ThemeModeIconProps) {
  const {mode, class: className} = props;

  if (mode === 'light') {
    return <SunIcon class={className} />;
  }
  if (mode === 'dark') {
    return <MoonIcon class={className} />;
  }
  return <AutoThemeIcon class={className} />;
}
