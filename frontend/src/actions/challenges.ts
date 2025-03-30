'use server';

import { auth } from '@clerk/nextjs/server';
import axios from 'axios';

import {
  CreateChallengeRequest,
  CreateChallengeResponse,
  GetChallengeResponse,
  createChallengeResponseSchema,
  getChallengeResponseSchema,
} from '@/types/challenges';

import { JWT_TEMPLATE_NAME } from '@/lib/constants';

export async function getChallenge(challengeId: string): Promise<GetChallengeResponse> {
  const authInstance = await auth();
  const token: string | null = await authInstance.getToken({
    template: JWT_TEMPLATE_NAME,
  });
  if (!token) {
    throw new Error('No Clerk token found');
  }
  try {
    console.log('Getting challenge');
    const response = await axios.get(
      `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/challenges/${challengeId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log('response', response.data);
    return getChallengeResponseSchema.parse(response.data);
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

export async function createChallenge(
  challenge: CreateChallengeRequest,
): Promise<CreateChallengeResponse> {
  const authInstance = await auth();
  const token: string | null = await authInstance.getToken({
    template: JWT_TEMPLATE_NAME,
  });
  if (!token) {
    throw new Error('No Clerk token found');
  }

  try {
    console.log('Creating challenge');
    const response = await axios.post(
      `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/challenges`,
      challenge,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return createChallengeResponseSchema.parse(response.data);
  } catch (error) {
    console.error('Error creating challenge:', error);
    throw error;
  }
}
