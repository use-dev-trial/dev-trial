import { z } from 'zod';

export const file = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string(),
});

export type File = z.infer<typeof file>;
