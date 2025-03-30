import { z } from 'zod';

import { problem } from '@/types/problems';

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
  problem: problem,
  files: z.array(file),
  test_cases: z.array(test_case),
});

export type Question = z.infer<typeof question>;

export const defaultQuestion: Question = {
  id: '',
  problem: {
    id: '',
    title: 'Untitled Question',
    description: 'Add a description for your coding interview question.',
    requirements: ['List your requirements here'],
  },
  files: [],
  test_cases: [],
};
