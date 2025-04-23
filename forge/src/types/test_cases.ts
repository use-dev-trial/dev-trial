import { z } from 'zod';

export const test_case = z.object({
  id: z.string(),
  description: z.string(),
  input: z.string(),
  expected_output: z.string(),
});

export type TestCase = z.infer<typeof test_case>;
