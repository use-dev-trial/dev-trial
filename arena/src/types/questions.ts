import { z } from 'zod';

import { file } from '@/types/files';
import { problem } from '@/types/problems';

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
    title: '',
    description: '',
    requirements: [],
  },
  files: [],
  test_cases: [],
};
