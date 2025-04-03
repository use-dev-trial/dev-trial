'use server';

import axios from 'axios';

import { Question, question } from '@/types/questions';

import { getClerkToken } from '@/lib/clerk';

export async function getQuestionById(questionId: string): Promise<Question> {
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
    console.log('Get Question By Id Response', response.data);
    return question.parse(response.data);
  } catch (error) {
    console.error('Error getting question by id:', error);
    throw error;
  }
}

export async function getQuestionsByChallengeId(challengeId: string): Promise<Question[]> {
  const token: string = await getClerkToken();

  try {
    console.log('Getting questions associated with challenge id...');
    const response = await axios.get(
      `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/questions/${challengeId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log('Get Questions By Challenge Id Response', response.data);
    return response.data.map((q: Question) => question.parse(q));
  } catch (error) {
    console.error('Error getting questions by challenge id:', error);
    throw error;
  }
}
