'use client';

import { useState } from 'react';

import { deleteMetric, upsertMetric } from '@/actions/metrics';
import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';

import { DeleteMetricRequest, Metric, UpsertMetricRequest } from '@/types/metrics';

interface useMetricsResult {
  metrics: Metric[];
  setMetrics: React.Dispatch<React.SetStateAction<Metric[]>>;
  upsertMetric: UseMutationResult<void, Error, UpsertMetricRequest>['mutateAsync'];
  deleteMetric: UseMutationResult<void, Error, DeleteMetricRequest>['mutateAsync'];
  isPending: boolean;
  error: Error | null;
}

export function useMetrics(defaultMetrics: Metric[]): useMetricsResult {
  const [metrics, setMetrics] = useState<Metric[]>(defaultMetrics);
  const queryClient = useQueryClient();
  const upsertMutation = useMutation<void, Error, UpsertMetricRequest>({
    mutationFn: upsertMetric,
    onError: (err) => {
      console.error('Error upserting metrics:', err.message);
    },
    onSuccess: () => {
      console.log('Successfully upserted metrics');
      queryClient.invalidateQueries({ queryKey: ['metrics'] });
    },
  });

  const deleteMutation = useMutation<void, Error, DeleteMetricRequest>({
    mutationFn: deleteMetric,
    onError: (err) => {
      console.error('Error deleting metrics:', err.message);
    },
    onSuccess: () => {
      console.log('Successfully deleted metrics');
      queryClient.invalidateQueries({ queryKey: ['metrics'] });
    },
  });

  return {
    metrics,
    setMetrics,
    upsertMetric: upsertMutation.mutateAsync,
    deleteMetric: deleteMutation.mutateAsync,
    isPending: upsertMutation.isPending,
    error: upsertMutation.error,
  };
}
