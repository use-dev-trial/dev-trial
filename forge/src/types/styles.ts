import { z } from 'zod';

export const style = z.object({
  id: z.string(),
  style: z.string(),
});

export type Style = z.infer<typeof style>;
