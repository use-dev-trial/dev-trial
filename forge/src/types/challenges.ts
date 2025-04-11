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
});

export type CreateChallengeRequest = z.infer<typeof createChallengeRequestSchema>;

export const getAllChallengesResponseSchema = z.object({
  challenges: z.array(challenge),
});

export type GetAllChallengesResponse = z.infer<typeof getAllChallengesResponseSchema>;
