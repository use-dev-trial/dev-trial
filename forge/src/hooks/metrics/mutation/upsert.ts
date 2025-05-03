'use client';

import { upsertMetric } from '@/actions/metrics';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { UpsertMetricRequest, UpsertMetricResponse } from '@/types/metrics';
import { GET_ALL_METRICS_QUERY_KEY } from '@/types/tanstack';

export function useUpsertMetric() {
  const queryClient = useQueryClient();

  const mutation = useMutation<UpsertMetricResponse, Error, UpsertMetricRequest>({
    mutationFn: upsertMetric,
    onError: (err) => {
      console.error('Error upserting metrics:', err.message);
    },
    onSuccess: (res: UpsertMetricResponse) => {
      console.log('Successfully upserted metrics:', res.id);
      queryClient.invalidateQueries({ queryKey: GET_ALL_METRICS_QUERY_KEY });
    },
  });

  return {
    upsertMetric: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  };
}
