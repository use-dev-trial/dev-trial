import { z } from 'zod';

export const problem = z.object({
  id: z.string().optional(), // remove this id later, added cus ci was failing and blocking me
  title: z.string(),
  description: z.string(),
  requirements: z.array(z.string()),
});

export type Problem = z.infer<typeof problem>;

export const file = z.object({
  name: z.string(),
  code: z.string(),
});

export type File = z.infer<typeof file>;

export const files = z.object({
  files: z.array(file),
});

export type Files = z.infer<typeof files>;

export const test_case = z.object({
  description: z.string(),
});

export type TestCase = z.infer<typeof test_case>;

export const test_cases = z.object({
  testCases: z.array(test_case),
});

export type TestCases = z.infer<typeof test_cases>;

export const question = z.object({
  problem: problem.nullable(),
  files: files.nullable(),
  test_cases: test_cases.nullable(),
});

export type Question = z.infer<typeof question>;
