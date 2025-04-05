import { auth } from '@clerk/nextjs/server';

import { JWT_TEMPLATE_NAME } from '@/lib/constants';

export async function getClerkToken(): Promise<string> {
  const authInstance = await auth();
  const token = await authInstance.getToken({
    template: JWT_TEMPLATE_NAME,
  });
  if (!token) {
    throw new Error('No Clerk token found');
  }
  return token;
}
