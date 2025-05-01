'use server';

import axios from 'axios';

import { DeleteMetricRequest, UpsertMetricRequest } from '@/types/metrics';

import { getClerkToken } from '@/lib/clerk';

export async function upsertMetric(request: UpsertMetricRequest) {
  const token: string = await getClerkToken();

  try {
    console.log('Upserting metric...');
    await axios.post(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/metrics`, request, {
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

export async function deleteMetric(request: DeleteMetricRequest): Promise<void> {
  const token: string = await getClerkToken();

  try {
    console.log('Deleting metric...');
    await axios.delete(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/metrics/${request.id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error('Error deleting metric:', error);
    throw error;
  }
}
