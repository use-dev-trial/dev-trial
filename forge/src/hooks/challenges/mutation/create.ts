'use client';

import { createChallenge as createChallengeAction } from '@/actions/challenges';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Challenge, CreateChallengeRequest } from '@/types/challenges';
import {
  CREATE_CHALLENGE_MUTATION_KEY,
  GET_ALL_CHALLENGES_QUERY_KEY,
  GET_SINGLE_CHALLENGE_QUERY_KEY_PREFIX,
} from '@/types/tanstack';

export function useCreateChallenge() {
  const queryClient = useQueryClient();

  const mutation = useMutation<Challenge, Error, CreateChallengeRequest>({
    mutationKey: CREATE_CHALLENGE_MUTATION_KEY,
    mutationFn: createChallengeAction,
    onError: (err) => {
      console.error('Error creating challenge:', err.message);
    },
    onSuccess: (res: Challenge) => {
      console.log('Successfully created a challenge:', res.id);
      // Trigger a refetch of the challenges list in the read hook
      queryClient.invalidateQueries({ queryKey: [GET_ALL_CHALLENGES_QUERY_KEY] });
      // Pre-seed the cache so if you navigate to the new challenge detail it’s instant
      queryClient.setQueryData([GET_SINGLE_CHALLENGE_QUERY_KEY_PREFIX, res.id], res);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [GET_ALL_CHALLENGES_QUERY_KEY] });
    },
  });

  return {
    createChallenge: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  };
}
