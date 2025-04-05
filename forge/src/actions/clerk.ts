'use server';

import axios from 'axios';

import {
  CreateOrganizationRequest,
  CreateOrganizationResponse,
  createOrganizationResponseSchema,
} from '@/types/clerk';

import { getClerkToken } from '@/lib/clerk';

export async function createOrganization(
  request: CreateOrganizationRequest,
): Promise<CreateOrganizationResponse> {
  const token: string = await getClerkToken();

  try {
    console.log('Creating organization:', request.name);
    const response = await axios.post(
      `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/clerk/organizations/create`,
      request,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return createOrganizationResponseSchema.parse(response.data);
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}
