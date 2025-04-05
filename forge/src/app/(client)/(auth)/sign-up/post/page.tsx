'use client';

import { useRouter } from 'next/navigation';

import { useEffect } from 'react';

import { ROUTES } from '@/lib/constants';

export default function PostSignUp() {
  const router = useRouter();
  //   const searchParams = useSearchParams();
  //   const invitationToken = searchParams.get('invitation');

  useEffect(() => {
    async function processPostSignUp() {
      //   if (invitationToken) {
      //     // TODO:
      //     // Call your backend API to validate and join the organization based on the invitation token
      //     // e.g.: await fetch('/api/join-organization', { method: 'POST', body: JSON.stringify({ invitationToken }) });
      //     // Or server action might do as well
      //     router.push('/dashboard');
      //   } else {
      // No invitation token found: redirect to create organization page
      router.push(ROUTES.SETTINGS);
      //   }
    }
    processPostSignUp();
  }, [router]);

  return <div>Processing your account setup...</div>;
}
