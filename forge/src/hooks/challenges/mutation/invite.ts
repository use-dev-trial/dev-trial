import { inviteCandidates as inviteCandidatesAction } from '@/actions/candidates';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { InviteCandidatesRequest } from '@/types/candidates';
import { INVITE_CANDIDATES_MUTATION_KEY } from '@/types/tanstack';

export function useInviteCandidates() {
  const queryClient = useQueryClient();

  const mutation = useMutation<void, Error, InviteCandidatesRequest>({
    mutationKey: INVITE_CANDIDATES_MUTATION_KEY,
    mutationFn: inviteCandidatesAction,
    onError: (err) => {
      console.error('Error inviting candidates:', err.message);
    },
    onSuccess: () => {
      console.log('Successfully invited candidates');
      queryClient.invalidateQueries({ queryKey: INVITE_CANDIDATES_MUTATION_KEY });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: INVITE_CANDIDATES_MUTATION_KEY });
    },
  });

  return {
    inviteCandidates: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  };
}
