import type {StyleRule} from '@vanilla-extract/css';

/*
 * Styles.
 */

/** Resolved dark theme is always `html[data-theme="dark"]` (boot script + app keep this in sync). */
const DARK_HTML = 'html[data-theme="dark"]';

/** Selector for `globalStyle` when the resolved theme is dark. */
export const darkHtmlSelector = DARK_HTML;

/*
 * Helpers.
 */

/** Descendant selector under the dark document root (optional pseudo, e.g. `:hover`). */
export function darkSelector(pseudo = ''): string {
  if (pseudo.length === 0) {
    return `${DARK_HTML} &`;
  }
  const suffix = pseudo.startsWith(':') || pseudo.startsWith('::') ? pseudo : ` ${pseudo}`;
  return `${DARK_HTML} &${suffix}`;
}

/** Scoped property rules when the document root is in the resolved dark theme. */
export function inDarkScheme<T extends StyleRule>(rules: T): {selectors: Record<string, T>} {
  return {
    selectors: {
      [darkSelector()]: rules
    }
  };
}
