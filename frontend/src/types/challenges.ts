import { z } from 'zod';

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

export const challengeResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  question_id: z.string(),
});

export type ChallengeResponse = z.infer<typeof challengeResponseSchema>;
