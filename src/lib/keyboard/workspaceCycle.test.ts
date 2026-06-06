import {describe, expect, test} from 'vitest';

import {resolveAdjacentWorkspaceId} from '@/lib/keyboard/workspaceCycle';
import type {Workspaces} from '@/schemas/workspace';

/*
 * Constants.
 */

const WORKSPACES: Workspaces = [
  {id: 'a', name: 'Alpha', configPath: '/a/config.toml', storagePath: '/a/db'},
  {id: 'b', name: 'Beta', configPath: '/b/config.toml', storagePath: '/b/db'},
  {id: 'c', name: 'Gamma', configPath: '/c/config.toml', storagePath: '/c/db'}
];

/*
 * Tests.
 */

describe('resolveAdjacentWorkspaceId', () => {
  test('next wraps from last workspace to first', () => {
    expect(resolveAdjacentWorkspaceId(WORKSPACES, 'c', 'next')).toBe('a');
  });

  test('prev wraps from first workspace to last', () => {
    expect(resolveAdjacentWorkspaceId(WORKSPACES, 'a', 'prev')).toBe('c');
  });

  test('next advances within the list', () => {
    expect(resolveAdjacentWorkspaceId(WORKSPACES, 'a', 'next')).toBe('b');
  });

  test('prev moves backward within the list', () => {
    expect(resolveAdjacentWorkspaceId(WORKSPACES, 'b', 'prev')).toBe('a');
  });

  test('uses first workspace when active id is missing', () => {
    expect(resolveAdjacentWorkspaceId(WORKSPACES, undefined, 'next')).toBe('b');
    expect(resolveAdjacentWorkspaceId(WORKSPACES, undefined, 'prev')).toBe('c');
  });

  test('returns undefined when no workspaces are registered', () => {
    expect(resolveAdjacentWorkspaceId([], 'a', 'next')).toBeUndefined();
  });
});
