'use server';

import { auth } from '@clerk/nextjs/server';
import axios from 'axios';

import {
  UpsertProblemRequest,
  UpsertProblemResponse,
  upsertProblemResponseSchema,
} from '@/types/problems';

import { JWT_TEMPLATE_NAME } from '@/lib/constants';

export async function upsertProblem(request: UpsertProblemRequest): Promise<UpsertProblemResponse> {
  const authInstance = await auth();
  const token: string | null = await authInstance.getToken({
    template: JWT_TEMPLATE_NAME,
  });
  if (!token) {
    throw new Error('No Clerk token found');
  }
  try {
    console.log('Sending message:', request);
    const response = await axios.post(
      `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/problems`,
      request,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return upsertProblemResponseSchema.parse(response.data);
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}
