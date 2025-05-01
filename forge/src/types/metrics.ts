import { z } from 'zod';

import { upsertMixin } from '@/types/base';

export const metric = z.object({
  id: z.string(),
  content: z.string(),
});

export type Metric = z.infer<typeof metric>;

export const upsertMetricRequestSchema = metric.merge(upsertMixin);

export type UpsertMetricRequest = z.infer<typeof upsertMetricRequestSchema>;

export const upsertMetricResponseSchema = upsertMetricRequestSchema;

export type UpsertMetricResponse = z.infer<typeof upsertMetricResponseSchema>;
