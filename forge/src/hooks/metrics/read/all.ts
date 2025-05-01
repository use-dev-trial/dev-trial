'use client';

import { getAllMetrics } from '@/actions/metrics';
import { useQuery } from '@tanstack/react-query';

import { Metric } from '@/types/metrics';
import { GET_ALL_METRICS_QUERY_KEY } from '@/types/tanstack';

export function useGetAllMetrics() {
  const {
    data: metrics,
    isLoading,
    error,
  } = useQuery<Metric[]>({
    queryKey: GET_ALL_METRICS_QUERY_KEY,
    queryFn: () => getAllMetrics().then((response) => response.challenges),
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 1000 * 60, // cache fresh for 1 minute
  });

  return {
    metrics: metrics ?? [],
    isLoading,
    error,
  };
}
