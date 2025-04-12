'use client';

import { upsertMetrics } from '@/actions/grading';
import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';

import { Metrics } from '@/types/grading';

interface useMetricsResult {
  upsertMetrics: UseMutationResult<void, Error, Metrics>['mutateAsync'];
  isPending: boolean;
  error: Error | null;
}

export function useMetrics(): useMetricsResult {
  const queryClient = useQueryClient();
  const mutation = useMutation<void, Error, Metrics>({
    mutationFn: upsertMetrics,
    onError: (err) => {
      console.error('Error upserting metrics:', err.message);
    },
    onSuccess: () => {
      console.log('Successfully upserted metrics');
      queryClient.invalidateQueries({ queryKey: ['metrics'] });
    },
  });

  return {
    upsertMetrics: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  };
}
