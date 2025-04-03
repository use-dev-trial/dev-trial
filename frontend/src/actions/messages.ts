'use server';

import axios from 'axios';

import { MessageRequest, MessageResponse, messageResponseSchema } from '@/types/messages';

import { getClerkToken } from '@/lib/clerk';

export async function send(request: MessageRequest): Promise<MessageResponse> {
  const token: string = await getClerkToken();

  try {
    console.log('Sending message:', request);
    const response = await axios.post(
      `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/messages`,
      request,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return messageResponseSchema.parse(response.data);
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}
