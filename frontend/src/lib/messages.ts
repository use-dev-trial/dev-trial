import { z } from 'zod';

export const role = z.enum(['user', 'assistant']);

export type Role = z.infer<typeof role>;

export const message = z.object({
  role,
  content: z.string(),
});

export type Message = z.infer<typeof message>;

export const messageRequestSchema = z.object({
  id: z.string().nullable().optional().default(null),
  content: z.string(),
});

export type MessageRequest = z.infer<typeof messageRequestSchema>;

export const messageResponseSchema = z.object({
  content: z.string(),
});

export type MessageResponse = z.infer<typeof messageResponseSchema>;
