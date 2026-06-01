import {workspaceSwatches} from '@/styles/tokens';

/*
 * Constants.
 */

/** Non-zero FNV-1a seed so one-character names still scatter across the palette. */
const FNV_OFFSET_BASIS = 2_166_136_261;
/** FNV-1a byte multiplier so each character reshuffles the full hash, not just the tail. */
const FNV_PRIME = 16_777_619;

/*
 * Helpers.
 */

/** Stable swatch index for a workspace name (FNV-1a over trimmed lowercase UTF-16). */
export function workspaceSwatchIndex(name: string): number {
  // Same logical name should keep the same accent after re-register or casing drift.
  const normalized = name.trim().toLowerCase();
  // Seed the hash so short names still spread across the palette.
  let hash = FNV_OFFSET_BASIS;

  // Stir in every character so nearby names are not stuck on one swatch.
  for (const char of normalized) {
    hash ^= char.codePointAt(0) ?? 0;
    hash = Math.imul(hash, FNV_PRIME);
  }

  // Stay in palette bounds even when the hash goes negative as a signed int.
  return (hash >>> 0) % workspaceSwatches.length;
}
