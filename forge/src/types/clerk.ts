import { z } from 'zod';

export const createOrganizationRequestSchema = z.object({
  user_id: z.string(),
  name: z.string(),
});

export type CreateOrganizationRequest = z.infer<typeof createOrganizationRequestSchema>;

export const createOrganizationResponseSchema = z.object({
  id: z.string(),
});

export type CreateOrganizationResponse = z.infer<typeof createOrganizationResponseSchema>;
