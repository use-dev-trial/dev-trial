'use client';

import { getAllChallenges } from '@/actions/challenges';
import { useQuery } from '@tanstack/react-query';

import { Challenge } from '@/types/challenges';

export function useAllChallenges() {
  const {
    data: challenges,
    isLoading,
    error,
  } = useQuery<Challenge[]>({
    queryKey: ['challenges'],
    queryFn: () => getAllChallenges().then((response) => response.challenges),
    refetchOnWindowFocus: false,
  });

  return {
    challenges: challenges || [],
    isLoading,
    error: error as Error | null,
  };
}
