'use server';

import { auth } from '@clerk/nextjs/server';
import axios from 'axios';

import {
  Challenge,
  CreateChallengeRequest,
  GetAllChallengesResponse,
  challenge,
  getAllChallengesResponseSchema,
} from '@/types/challenges';

import { JWT_TEMPLATE_NAME } from '@/lib/constants';

export async function getChallenge(challengeId: string): Promise<Challenge> {
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
    console.log('Get Challenge Response', response.data);
    return challenge.parse(response.data);
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

export async function createChallenge(input: CreateChallengeRequest): Promise<Challenge> {
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
      input,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return challenge.parse(response.data);
  } catch (error) {
    console.error('Error creating challenge:', error);
    throw error;
  }
}

export async function getAllChallenges(): Promise<GetAllChallengesResponse> {
  const authInstance = await auth();
  const token: string | null = await authInstance.getToken({
    template: JWT_TEMPLATE_NAME,
  });
  if (!token) {
    throw new Error('No Clerk token found');
  }
  try {
    console.log('Getting all challenges');
    const response = await axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/challenges`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('response', response.data);
    return getAllChallengesResponseSchema.parse(response.data);
  } catch (error) {
    console.error('Error getting all challenges:', error);
    throw error;
  }
}
