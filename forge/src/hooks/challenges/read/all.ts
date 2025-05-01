'use client';

import { getAllChallenges } from '@/actions/challenges';
import { useQuery } from '@tanstack/react-query';

import { Challenge } from '@/types/challenges';
import { GET_ALL_CHALLENGES_QUERY_KEY } from '@/types/tanstack';

export function useGetAllChallenges() {
  const {
    data: challenges,
    isLoading,
    error,
  } = useQuery<Challenge[]>({
    queryKey: GET_ALL_CHALLENGES_QUERY_KEY,
    queryFn: () => getAllChallenges().then((response) => response.challenges),
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 1000 * 60, // cache fresh for 1 minute
  });

  return {
    challenges: challenges ?? [],
    isLoading,
    error,
  };
}
