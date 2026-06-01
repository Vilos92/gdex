import {describe, expect, test} from 'vitest';

import {workspaceSwatchIndex} from '@/lib/workspaceSwatch';
import {workspaceSwatches} from '@/styles/tokens';

/*
 * Constants.
 */

const swatchCount = workspaceSwatches.length;

const equivalentNames = ['greg', ' Greg ', 'GREG', '\tgreg\n'] as const;

const spreadSampleNames = ['greg', 'front', 'work', 'dex'] as const;

/*
 * Tests.
 */

describe('workspaceSwatchIndex', () => {
  test('maps equivalent names to the same swatch', () => {
    const [baseline, ...variants] = equivalentNames;
    const expected = workspaceSwatchIndex(baseline);

    for (const name of variants) {
      expect(workspaceSwatchIndex(name)).toBe(expected);
    }
  });

  test('treats whitespace-only names like the empty string', () => {
    expect(workspaceSwatchIndex('   ')).toBe(workspaceSwatchIndex(''));
  });

  // Index feeds `workspaceSwatches[index]` — these inputs stress trim, `codePointAt`, and modulo edge cases.
  test.each(['', 'a', 'workspace-β', '🦀'] as const)('keeps %j within palette bounds', name => {
    const index = workspaceSwatchIndex(name);

    expect(index).toBeGreaterThanOrEqual(0);
    expect(index).toBeLessThan(swatchCount);
    expect(Number.isInteger(index)).toBe(true);
  });

  test('does not collapse every sample name onto one swatch', () => {
    const indices = new Set(spreadSampleNames.map(name => workspaceSwatchIndex(name)));

    expect(indices.size).toBeGreaterThan(1);
  });
});
