import { z } from 'zod';

export const inviteCandidatesRequestSchema = z.object({
  challenge_id: z.string(),
  emails: z.array(z.string()),
});

export type InviteCandidatesRequest = z.infer<typeof inviteCandidatesRequestSchema>;
