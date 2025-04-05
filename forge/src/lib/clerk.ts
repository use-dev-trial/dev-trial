import { auth } from '@clerk/nextjs/server';

import { JWT_TEMPLATE_NAME } from '@/lib/constants';

export async function getClerkToken(): Promise<string> {
  const authInstance = await auth();
  if (!authInstance.orgId) {
    throw new Error('No Clerk orgId found. User is not part of an active organization.');
  }
  const token = await authInstance.getToken({
    template: JWT_TEMPLATE_NAME,
  });
  if (!token) {
    throw new Error('No Clerk token found');
  }
  return token;
}
