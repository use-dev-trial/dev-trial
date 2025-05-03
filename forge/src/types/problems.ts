import { z } from 'zod';

export const problem = z.object({
  id: z.string(),
  question_id: z.string(),
  title: z.string(),
  description: z.string(),
  requirements: z.array(z.string()),
});

export type Problem = z.infer<typeof problem>;

export const defaultProblem: Problem = {
  id: '',
  question_id: '',
  title: '',
  description: '',
  requirements: [],
};
