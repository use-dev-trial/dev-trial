import { z } from 'zod';

export const metric = z.object({
  id: z.string(),
  content: z.string(),
});

export type Metric = z.infer<typeof metric>;
