'use server';

import axios from 'axios';

import { InviteCandidatesRequest } from '@/types/candidates';

import { getClerkToken } from '@/lib/clerk';

export async function inviteCandidates(input: InviteCandidatesRequest): Promise<void> {
  const token: string = await getClerkToken();
  try {
    console.log('Inviting candidates...');
    await axios.post(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/candidates`, input, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error('Error inviting candidates:', error);
    throw error;
  }
}
