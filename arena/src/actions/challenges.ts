'use server';

import axios from 'axios';

import { Challenge, challenge } from '@/types/challenges';

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
