import { z } from 'zod';

export const upsertMixin = z.object({
  question_id: z.string(),
});

export type UpsertMixin = z.infer<typeof upsertMixin>;
