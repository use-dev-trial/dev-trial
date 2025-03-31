import { z } from 'zod';

import { question } from '@/types/question';

export const challenge = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
});

export type Challenge = z.infer<typeof challenge>;

export const createChallengeRequestSchema = z.object({
  name: z.string(),
  description: z.string(),
  question_id: z.string(),
});

export type CreateChallengeRequest = z.infer<typeof createChallengeRequestSchema>;

export const createChallengeResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  question_id: z.string(),
});

export type CreateChallengeResponse = z.infer<typeof createChallengeResponseSchema>;

export const getChallengeResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  question: question.array(),
});

export type GetChallengeResponse = z.infer<typeof getChallengeResponseSchema>;
