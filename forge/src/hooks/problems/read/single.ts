'use client';

import { getProblem } from '@/actions/problems';
import { useQuery } from '@tanstack/react-query';

import { Problem } from '@/types/problems';
import { GET_SINGLE_PROBLEM_QUERY_KEY_PREFIX } from '@/types/tanstack';

export function useGetProblem(problemId: string) {
  const {
    data: problem,
    isLoading,
    error,
  } = useQuery<Problem>({
    queryKey: [GET_SINGLE_PROBLEM_QUERY_KEY_PREFIX, problemId],
    queryFn: () => {
      return getProblem(problemId);
    },
    enabled: Boolean(problemId),
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 1000 * 60, // cache fresh for 1 minute
  });

  return {
    problem: problem ?? null,
    isLoading,
    error,
  };
}
