import {z} from 'zod';

/*
 * Schemas.
 */

const optionalString = z
  .string()
  .nullish()
  .transform((value): string | undefined => value ?? undefined);

const taskWireSchema = z.object({
  id: z.string(),
  parent_id: optionalString,
  name: z.string(),
  description: optionalString,
  priority: z.number(),
  completed: z.boolean(),
  result: optionalString,
  started_at: optionalString,
  completed_at: optionalString,
  children: z.array(z.string()),
  blocked_by: z.array(z.string())
});

const taskSchema = taskWireSchema.transform(row => ({
  id: row.id,
  parentId: row.parent_id,
  name: row.name,
  description: row.description,
  priority: row.priority,
  completed: row.completed,
  result: row.result,
  startedAt: row.started_at,
  completedAt: row.completed_at,
  children: row.children as readonly string[],
  blockedBy: row.blocked_by as readonly string[]
}));

export const tasksSchema = z.array(taskSchema);

export type Task = z.output<typeof taskSchema>;

export type Tasks = readonly Task[];
