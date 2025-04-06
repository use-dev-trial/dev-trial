'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { useEffect } from 'react';

import { useOrganizationList, useSession, useUser } from '@clerk/nextjs';

import { ROUTES } from '@/lib/constants';

export default function SelectOrganizationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { session, isLoaded: isSessionLoaded } = useSession();
  const { user, isLoaded: isUserLoaded } = useUser();
  const { isLoaded: isOrgListLoaded, setActive } = useOrganizationList();

  useEffect(() => {
    if (!isSessionLoaded || !isOrgListLoaded || !isUserLoaded || !setActive || !session) {
      return;
    }

    const availableOrgMemberships = user?.organizationMemberships || [];
    const currentOrgId = session.lastActiveOrganizationId;
    const intendedRedirectUrl = searchParams.get('redirect_url') || ROUTES.CHALLENGES;

    // If user already has an active org (maybe they landed here unexpectedly), redirect them
    if (currentOrgId) {
      console.log(
        `SelectOrgPage: Org ${currentOrgId} is already active. Redirecting to ${intendedRedirectUrl}`,
      );
      router.replace(intendedRedirectUrl);
      return;
    }

    // If user has no orgs, redirect to create org page
    if (availableOrgMemberships.length === 0) {
      router.replace(ROUTES.CREATE_ORGANIZATION);
      return;
    }

    const firstOrgMembership = availableOrgMemberships[0];
    if (firstOrgMembership?.organization?.id) {
      setActive({ organization: firstOrgMembership.organization.id })
        .then(() => {
          router.replace(intendedRedirectUrl);
        })
        .catch((err) => {
          console.log('SelectOrgPage: Failed to set active organization', err);
          router.replace(ROUTES.CHALLENGES);
        });
    }
  }, [
    isSessionLoaded,
    isOrgListLoaded,
    isUserLoaded,
    session,
    user?.organizationMemberships,
    setActive,
    router,
    searchParams,
  ]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div>Checking organization status...</div>
    </div>
  );
}
