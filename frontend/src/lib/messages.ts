import { z } from 'zod';

import { question } from '@/lib/question';

export const role = z.enum(['user', 'assistant']);

export type Role = z.infer<typeof role>;

export const message = z.object({
  role,
  content: z.string(),
});

export type Message = z.infer<typeof message>;

export const messageRequestSchema = z.object({
  id: z.string().nullable().optional().default(null),
  question_id: z.string().nullable().optional().default(null),
  content: z.string(),
});

export type MessageRequest = z.infer<typeof messageRequestSchema>;

export const sampleInteractionSchema = z.object({
  title: z.string(),
  steps: z.array(z.string()),
});

export type SampleInteraction = z.infer<typeof sampleInteractionSchema>;

export const questionUpdateSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  requirements: z.array(z.string()).optional(),
  sampleInteractions: z.array(sampleInteractionSchema).optional(),
});

export type QuestionUpdate = z.infer<typeof questionUpdateSchema>;

export const messageResponseSchema = z.object({
  id: z.string(),
  content: z.string(),
  // questionUpdate: questionUpdateSchema.optional(),
  // updatedSections: z
  //   .array(z.enum(['title', 'description', 'requirements', 'sampleInteractions']))
  //   .optional(),
  question: question,
});

export type MessageResponse = z.infer<typeof messageResponseSchema>;
