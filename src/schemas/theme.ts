import {z} from 'zod';

/*
 * Types.
 */

export type ResolvedTheme = 'light' | 'dark';

/*
 * Schemas.
 */

export const themeModeSchema = z.enum(['light', 'dark', 'auto']);

/*
 * Inferred types.
 */

export type ThemeMode = z.infer<typeof themeModeSchema>;
