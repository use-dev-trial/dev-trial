'use server';

import axios from 'axios';

import {
  AssociateQuestionWithChallengeRequest,
  CreateTemplateQuestionRequest,
  Question,
  question,
} from '@/types/questions';

import { getClerkToken } from '@/lib/clerk';

export async function createTemplateQuestion(
  input: CreateTemplateQuestionRequest,
): Promise<Question> {
  const token: string = await getClerkToken();

  try {
    console.log('Creating template question...');
    const response = await axios.post(
      `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/questions/template`,
      input,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log('Successfully created template question');
    return question.parse(response.data);
  } catch (error) {
    console.error('Error creating template question:', error);
    throw error;
  }
}

export async function getQuestionById(questionId: string): Promise<Question> {
  const token: string = await getClerkToken();

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
  const token: string = await getClerkToken();

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

export async function getAllQuestions(): Promise<Question[]> {
  const token: string = await getClerkToken();

  try {
    console.log('Getting all questions...');
    const response = await axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/questions`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Successfully retrieved all questions');
    return response.data.map((q: Question) => question.parse(q));
  } catch (error) {
    console.error('Error getting all questions:', error);
    throw error;
  }
}

export async function associateQuestionWithChallenge(
  input: AssociateQuestionWithChallengeRequest,
): Promise<void> {
  const token: string = await getClerkToken();

  try {
    console.log('Associating question with challenge...');
    await axios.post(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/questions/associate`, input, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Successfully associated question with challenge');
  } catch (error) {
    console.error('Error associating question with challenge:', error);
    throw error;
  }
}
