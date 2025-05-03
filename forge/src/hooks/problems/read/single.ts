'use client';

import { getProblemByQuestionId } from '@/actions/problems';
import { useQuery } from '@tanstack/react-query';

import { Problem } from '@/types/problems';
import { GET_SINGLE_PROBLEM_QUERY_KEY_PREFIX as GET_PROBLEM_BY_QUESTION_ID_QUERY_KEY_PREFIX } from '@/types/tanstack';

export function useGetProblemByQuestionId(question_id: string) {
  const {
    data: problem,
    isLoading,
    error,
  } = useQuery<Problem>({
    queryKey: [GET_PROBLEM_BY_QUESTION_ID_QUERY_KEY_PREFIX, question_id],
    queryFn: () => {
      return getProblemByQuestionId(question_id);
    },
    enabled: Boolean(question_id),
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
