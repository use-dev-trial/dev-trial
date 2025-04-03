'use server';

import { auth } from '@clerk/nextjs/server';
import axios from 'axios';

import { Question, question } from '@/types/questions';

import { JWT_TEMPLATE_NAME } from '@/lib/constants';

export async function getQuestion(questionId: string): Promise<Question> {
  const authInstance = await auth();
  const token: string | null = await authInstance.getToken({
    template: JWT_TEMPLATE_NAME,
  });
  if (!token) {
    throw new Error('No Clerk token found');
  }
  try {
    console.log('Getting question...');
    const response = await axios.get(
      `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/questions/${questionId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log('Get Question Response', response.data);
    return question.parse(response.data);
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}
