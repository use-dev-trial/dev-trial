'use client';

import { deleteChallenge as deleteChallengeAction } from '@/actions/challenges';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { GET_ALL_CHALLENGES_QUERY_KEY } from '@/types/tanstack';

export function useDeleteChallenge() {
  const queryClient = useQueryClient();

  const mutation = useMutation<void, Error, string>({
    mutationFn: (id: string) => deleteChallengeAction(id),
    onError: (err) => {
      console.error('Error deleting challenge:', err.message);
    },
    onSuccess: () => {
      console.log('Successfully deleted a challenge:');
      // Trigger a refetch of the challenges list in the read hook
      queryClient.invalidateQueries({ queryKey: [GET_ALL_CHALLENGES_QUERY_KEY] });
    },
  });

  return {
    deleteChallenge: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  };
}
