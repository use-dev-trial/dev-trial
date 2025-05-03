'use client';

import { upsertProblem } from '@/actions/problems';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Problem } from '@/types/problems';
import { GET_SINGLE_PROBLEM_QUERY_KEY_PREFIX } from '@/types/tanstack';

export function useUpsertProblem() {
  const queryClient = useQueryClient();

  const mutation = useMutation<Problem, Error, Problem>({
    mutationFn: upsertProblem,
    onError: (err) => {
      console.error('Error upserting problem:', err.message);
    },
    onSuccess: (res: Problem) => {
      console.log('Successfully upserted problem:', res.id);
      queryClient.invalidateQueries({ queryKey: [GET_SINGLE_PROBLEM_QUERY_KEY_PREFIX, res.id] });
    },
  });

  return {
    upsertProblem: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  };
}
