import {z} from 'zod';

/*
 * Schemas.
 */

export const themeModeSchema = z.enum(['light', 'dark', 'auto']);

export type ThemeMode = z.infer<typeof themeModeSchema>;

export type ResolvedTheme = 'light' | 'dark';
