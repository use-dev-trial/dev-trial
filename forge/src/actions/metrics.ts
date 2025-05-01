'use server';

import axios from 'axios';

import {
  GetAllMetricsResponse,
  UpsertMetricRequest,
  UpsertMetricResponse,
  getAllMetricsResponseSchema,
  upsertMetricResponseSchema,
} from '@/types/metrics';

import { getClerkToken } from '@/lib/clerk';

export async function upsertMetric(request: UpsertMetricRequest): Promise<UpsertMetricResponse> {
  const token: string = await getClerkToken();

  try {
    console.log('Upserting metric...');
    const response = await axios.post(
      `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/metrics`,
      request,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return upsertMetricResponseSchema.parse(response.data);
  } catch (error) {
    console.error('Error upserting metric:', error);
    throw error;
  }
}

export async function deleteMetric(id: string): Promise<void> {
  const token: string = await getClerkToken();

  try {
    console.log('Deleting metric...');
    await axios.delete(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/metrics/${id}`, {
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

export async function getAllMetrics(question_id: string): Promise<GetAllMetricsResponse> {
  const token: string = await getClerkToken();

  try {
    console.log('Getting all metrics...');
    const response = await axios.get(
      `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/metrics/${question_id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log('Get All Metrics Response', response.data);
    return getAllMetricsResponseSchema.parse(response.data);
  } catch (error) {
    console.error('Error getting all metrics:', error);
    throw error;
  }
}
