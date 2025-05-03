'use server';

import axios from 'axios';

import { Problem, problem } from '@/types/problems';

import { getClerkToken } from '@/lib/clerk';

export async function upsertProblem(request: Problem): Promise<Problem> {
  const token: string = await getClerkToken();

  try {
    console.log('Upserting problem:', request);
    const response = await axios.post(
      `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/problems`,
      request,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return problem.parse(response.data);
  } catch (error) {
    console.error('Error upserting problem:', error);
    throw error;
  }
}

export async function getProblemByQuestionId(question_id: string): Promise<Problem> {
  const token: string = await getClerkToken();

  try {
    console.log('Getting problem by question id:', question_id);
    const response = await axios.get(
      `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/questions/${question_id}/problem`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return problem.parse(response.data);
  } catch (error) {
    console.error('Error getting problem by question id:', error);
    throw error;
  }
}
