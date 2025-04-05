import { z } from 'zod';

export const challenge = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
});

export type Challenge = z.infer<typeof challenge>;
