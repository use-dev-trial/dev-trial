'use server';

import axios from 'axios';

import { Metrics } from '@/types/grading';

import { getClerkToken } from '@/lib/clerk';

export async function upsertMetrics(request: Metrics) {
  const token: string = await getClerkToken();

  try {
    console.log('Upserting metrics...');
    await axios.post(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/grading/metrics`, request, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error('Error upserting metrics:', error);
    throw error;
  }
}
