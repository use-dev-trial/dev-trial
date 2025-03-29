import { z } from 'zod';

export const problem = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  requirements: z.array(z.string()),
});

export type Problem = z.infer<typeof problem>;

export const file = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string(),
});

export type File = z.infer<typeof file>;

export const test_case = z.object({
  id: z.string(),
  description: z.string(),
});

export type TestCase = z.infer<typeof test_case>;

export const question = z.object({
  id: z.string(),
  problem: problem.nullable(),
  files: z.array(file).nullable(),
  test_cases: z.array(test_case).nullable(),
});

export type Question = z.infer<typeof question>;
