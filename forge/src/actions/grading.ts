'use server';

import axios from 'axios';

import { Metric } from '@/types/grading';

import { getClerkToken } from '@/lib/clerk';

export async function upsertMetric(request: Metric) {
  const token: string = await getClerkToken();

  try {
    console.log('Upserting metric...');
    await axios.post(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/grading/metrics`, request, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error('Error upserting metric:', error);
    throw error;
  }
}
