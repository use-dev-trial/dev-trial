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

export async function getProblem(problemId: string): Promise<Problem> {
  const token: string = await getClerkToken();

  try {
    console.log('Getting problem:', problemId);
    const response = await axios.get(
      `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/problems/${problemId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return problem.parse(response.data);
  } catch (error) {
    console.error('Error getting problem:', error);
    throw error;
  }
}
