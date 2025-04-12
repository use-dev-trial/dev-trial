import { z } from 'zod';

export const metricSchema = z.object({
  id: z.string(),
  question_id: z.string(),
  content: z.string(),
});

export type Metric = z.infer<typeof metricSchema>;
