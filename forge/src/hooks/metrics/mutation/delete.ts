'use client';

import { deleteMetric, upsertMetric } from '@/actions/metrics';
import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';

import { DeleteMetricRequest, Metric, UpsertMetricRequest } from '@/types/metrics';

interface UseDeleteMetricResult {
  deleteMetric: (id: string) => Promise<void>;
  isPending: boolean;
  error: Error | null;
}

export function useDeleteMetric(): UseDeleteMetricResult {
  const queryClient = useQueryClient();

  const mutation = useMutation<void, Error, string>({
    mutationFn: (id: string) => deleteMetric(id),
    onError: (err) => {
      console.error('Error deleting a metric:', err.message);
    },
    onSuccess: () => {
      console.log('Successfully deleted a metric');
      queryClient.invalidateQueries({ queryKey: ['metrics'] });
    },
  });

  return {
    deleteMetric: deleteMutation.mutateAsync,
    isPending: upsertMutation.isPending,
    error: upsertMutation.error,
  };
}
