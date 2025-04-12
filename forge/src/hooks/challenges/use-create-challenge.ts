'use client';

import { createChallenge as createChallengeAction } from '@/actions/challenges';
import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';

import { Challenge, CreateChallengeRequest } from '@/types/challenges';

interface UseCreateChallengeResult {
  createChallenge: UseMutationResult<Challenge, Error, CreateChallengeRequest>['mutateAsync'];
  isPending: boolean;
  error: Error | null;
}

export function useCreateChallenge(): UseCreateChallengeResult {
  const queryClient = useQueryClient();

  const mutation = useMutation<Challenge, Error, CreateChallengeRequest>({
    mutationFn: createChallengeAction,
    onError: (err) => {
      console.error('Error creating challenge:', err.message);
    },
    onSuccess: (data) => {
      console.log('Successfully created a challenge:', data);
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
    },
  });

  return {
    createChallenge: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  };
}
