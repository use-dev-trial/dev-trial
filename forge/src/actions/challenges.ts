'use server';

import axios from 'axios';

import {
  Challenge,
  CreateChallengeRequest,
  GetAllChallengesResponse,
  challenge,
  getAllChallengesResponseSchema,
} from '@/types/challenges';

import { getClerkToken } from '@/lib/clerk';

export async function getChallenge(challengeId: string): Promise<Challenge> {
  const token: string = await getClerkToken();
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
  const token: string = await getClerkToken();

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
  const token: string = await getClerkToken();

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

export async function deleteChallenge(id: string): Promise<void> {
  const token: string = await getClerkToken();

  try {
    console.log('Deleting challenge');
    await axios.delete(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/challenges/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error('Error deleting challenge:', error);
    throw error;
  }
}
