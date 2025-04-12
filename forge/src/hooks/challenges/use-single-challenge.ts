'use client';

import { getChallenge } from '@/actions/challenges';
import { useQuery } from '@tanstack/react-query';

import { Challenge } from '@/types/challenges';

export function useSingleChallenge(challengeId: string) {
  const {
    data: challenge,
    isLoading,
    error,
    isFetching,
  } = useQuery<Challenge>({
    queryKey: ['challenge', challengeId],
    queryFn: () => {
      return getChallenge(challengeId);
    },
    enabled: !!challengeId,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return {
    challenge,
    isLoading,
    isFetching,
    error: error as Error | null,
  };
}
