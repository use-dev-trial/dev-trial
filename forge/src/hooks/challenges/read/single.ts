'use client';

import { getChallenge } from '@/actions/challenges';
import { useQuery } from '@tanstack/react-query';

import { Challenge } from '@/types/challenges';
import { GET_SINGLE_CHALLENGE_QUERY_KEY_PREFIX } from '@/types/tanstack';

export function useGetSingleChallenge(challengeId: string) {
  const {
    data: challenge,
    isLoading,
    error,
  } = useQuery<Challenge>({
    queryKey: [GET_SINGLE_CHALLENGE_QUERY_KEY_PREFIX, challengeId],
    queryFn: () => {
      return getChallenge(challengeId);
    },
    enabled: Boolean(challengeId),
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 1000 * 60, // cache fresh for 1 minute
  });

  return {
    challenge: challenge ?? null,
    isLoading,
    error,
  };
}
