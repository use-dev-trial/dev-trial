'use client';

import { createChallenge, getAllChallenges } from '@/actions/challenges';
import { UseMutationResult, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Challenge, CreateChallengeRequest } from '@/types/challenges';

interface useChallengeOptions {
  challenges: Challenge[] | [];
  isLoading: boolean;
  error: Error | null;
  createChallengeMutation: UseMutationResult<Challenge, Error, CreateChallengeRequest, unknown>;
}

export default function useChallenge(): useChallengeOptions {
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery<Challenge[]>({
    queryKey: ['challenges'],
    queryFn: () => getAllChallenges().then((response) => response.challenges),
    refetchOnWindowFocus: false,
  });

  const createMutation = useMutation({
    mutationFn: (challengeParams: CreateChallengeRequest) => createChallenge(challengeParams),
    mutationKey: ['createChallenge'],
    onError: (err) => {
      console.error('Error creating challenge:', err.message);
      // On error, just refetch the data
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
    },
    onSuccess: (data) => {
      console.log('Successfully created a challenge');
      queryClient.setQueryData<Challenge[]>(['challenges'], (oldData) => {
        if (!oldData) return [data];
        return [...oldData, data];
      });
    },
  });

  return {
    challenges: data || [],
    isLoading,
    error,
    createChallengeMutation: createMutation,
  };
}
