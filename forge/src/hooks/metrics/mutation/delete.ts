'use client';

import { deleteMetric } from '@/actions/metrics';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { GET_ALL_METRICS_QUERY_KEY } from '@/types/tanstack';

export function useDeleteMetric() {
  const queryClient = useQueryClient();

  const mutation = useMutation<void, Error, string>({
    mutationFn: (id: string) => deleteMetric(id),
    onError: (err) => {
      console.error('Error deleting a metric:', err.message);
    },
    onSuccess: () => {
      console.log('Successfully deleted a metric');
      // Trigger a refetch of the metrics list in the read hook
      queryClient.invalidateQueries({ queryKey: GET_ALL_METRICS_QUERY_KEY });
    },
  });

  return {
    deleteMetric: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  };
}
