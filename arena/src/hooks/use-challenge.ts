'use client';

import { getChallenge } from '@/actions/challenges';
import { useQuery } from '@tanstack/react-query';

import { Challenge } from '../types/challenges';

interface useChallengeOptions {
  challenge: Challenge | null;
  isChallengeLoading: boolean;
  challengeError: Error | null;
}

export default function useChallenge(challengeId?: string): useChallengeOptions {
  const {
    data: challenge,
    isLoading: isChallengeLoading,
    error: challengeError,
  } = useQuery<Challenge>({
    queryKey: ['challenge', challengeId],
    queryFn: () => getChallenge(challengeId as string),
    enabled: !!challengeId,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return {
    challenge: challenge || null,
    isChallengeLoading,
    challengeError: challengeError as Error | null,
  };
}
