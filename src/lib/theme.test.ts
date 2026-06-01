import {afterEach, describe, expect, test, vi} from 'vitest';

import {resolveTheme} from '@/lib/theme';

/*
 * Tests.
 */

describe('resolveTheme', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('light and dark modes ignore system preference', () => {
    vi.stubGlobal('window', {
      matchMedia: () => ({matches: true})
    });

    expect(resolveTheme('light')).toBe('light');
    expect(resolveTheme('dark')).toBe('dark');
  });

  test('auto follows prefers-color-scheme', () => {
    vi.stubGlobal('window', {
      matchMedia: (query: string) => ({
        matches: query === '(prefers-color-scheme: dark)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      })
    });

    expect(resolveTheme('auto')).toBe('dark');
  });
});
