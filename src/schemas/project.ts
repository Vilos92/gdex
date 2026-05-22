import {z} from 'zod';

/*
 * Schemas.
 */

export const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  config_path: z.string(),
  storage_path: z.string()
});

export const projectsSchema = z.array(projectSchema);

export type Project = z.infer<typeof projectSchema>;

export type Projects = readonly Project[];
