import { z } from 'zod';

export const metricsSchema = z.object({
  id: z.string(),
  metrics: z.array(z.string()),
});

export type Metrics = z.infer<typeof metricsSchema>;
