import { z } from 'zod';

import { file } from '@/types/files';
import { metric } from '@/types/metrics';
import { problem } from '@/types/problems';
import { test_case } from '@/types/test_cases';

export const question = z.object({
  id: z.string(),
  problem: problem,
  files: z.array(file),
  test_cases: z.array(test_case),
  metrics: z.array(metric),
});

export type Question = z.infer<typeof question>;

export const createTemplateQuestionRequestSchema = z.object({
  challenge_id: z.string(),
});

export type CreateTemplateQuestionRequest = z.infer<typeof createTemplateQuestionRequestSchema>;

export const associateQuestionWithChallengeRequestSchema = z.object({
  question_id: z.string(),
  challenge_id: z.string(),
});

export type AssociateQuestionWithChallengeRequest = z.infer<
  typeof associateQuestionWithChallengeRequestSchema
>;
