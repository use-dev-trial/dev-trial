'use server';

import { auth } from '@clerk/nextjs/server';
import axios from 'axios';

import { MessageRequest, MessageResponse, messageResponseSchema } from '@/types/messages';

import { JWT_TEMPLATE_NAME } from '@/lib/constants';

export async function send(request: MessageRequest): Promise<MessageResponse> {
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
