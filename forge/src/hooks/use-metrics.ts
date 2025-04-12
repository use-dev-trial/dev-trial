'use client';

import { upsertMetric } from '@/actions/grading';
import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';

import { Metric } from '@/types/grading';

interface useMetricsResult {
  upsertMetrics: UseMutationResult<void, Error, Metric>['mutateAsync'];
  isPending: boolean;
  error: Error | null;
}

export function useMetrics(): useMetricsResult {
  const queryClient = useQueryClient();
  const mutation = useMutation<void, Error, Metric>({
    mutationFn: upsertMetric,
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
