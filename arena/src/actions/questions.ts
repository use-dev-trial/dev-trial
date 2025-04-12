'use server';

import axios from 'axios';

import { Question, RunTestsInput, question } from '@/types/questions';

export async function getQuestionById(questionId: string): Promise<Question> {
  const token: string = 'await getClerkToken();';
  try {
    console.log('Getting question...');
    const response = await axios.get(
      `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/questions/question_id/${questionId}`,
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
  const token: string = 'await getClerkToken();';
  try {
    console.log('Getting questions associated with challenge id...');
    const response = await axios.get(
      `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/questions/challenge_id/${challengeId}`,
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

export async function runTests(questionId: string, input: RunTestsInput): Promise<void> {
  const token: string = 'await getClerkToken();';
  try {
    const response = await axios.post(
      `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/questions/run-tests/${questionId}`,
      input,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log('Run Tests Response', response.data);
  } catch (error) {
    console.error('Error running tests:', error);
    throw error;
  }
}
