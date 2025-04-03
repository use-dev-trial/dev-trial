'use server';

import axios from 'axios';

import {
  UpsertProblemRequest,
  UpsertProblemResponse,
  upsertProblemResponseSchema,
} from '@/types/problems';

import { getClerkToken } from '@/lib/clerk';

export async function upsertProblem(request: UpsertProblemRequest): Promise<UpsertProblemResponse> {
  const token: string = await getClerkToken();

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
