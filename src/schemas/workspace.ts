import {z} from 'zod';

/*
 * Schemas.
 */

const workspaceWireSchema = z.object({
  id: z.string(),
  name: z.string(),
  config_path: z.string(),
  storage_path: z.string()
});

export const workspaceSchema = workspaceWireSchema.transform(row => ({
  id: row.id,
  name: row.name,
  configPath: row.config_path,
  storagePath: row.storage_path
}));

export const workspacesSchema = z.array(workspaceSchema);

export type Workspace = z.output<typeof workspaceSchema>;

export type Workspaces = readonly Workspace[];
