'use server';

import axios from 'axios';

import { Question, question } from '@/types/questions';

import { getClerkToken } from '@/lib/clerk';

export async function getQuestion(questionId: string): Promise<Question> {
  const token: string = await getClerkToken();

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
