import { inviteCandidates as inviteCanidatesAction } from '@/actions/candidates';
import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';

import { InviteCandidatesRequest } from '@/types/candidates';

interface UseInviteCandidatesResult {
  inviteCandidates: UseMutationResult<void, Error, InviteCandidatesRequest>['mutateAsync'];
  isPending: boolean;
  error: Error | null;
}

export function useInviteCandidates(): UseInviteCandidatesResult {
  const queryClient = useQueryClient();

  const mutation = useMutation<void, Error, InviteCandidatesRequest>({
    mutationFn: inviteCanidatesAction,
    onError: (err) => {
      console.error('Error inviting candidates:', err.message);
    },
    onSuccess: () => {
      console.log('Successfully invited candidates');
      queryClient.invalidateQueries({ queryKey: ['invite'] });
    },
  });

  return {
    inviteCandidates: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  };
}
