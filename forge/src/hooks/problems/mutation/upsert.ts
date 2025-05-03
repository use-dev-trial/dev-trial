import { upsertProblem } from '@/actions/problems';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Problem } from '@/types/problems';
import { GET_SINGLE_PROBLEM_QUERY_KEY_PREFIX } from '@/types/tanstack';

type Context = { previous?: Problem };

export function useUpsertProblem() {
  const queryClient = useQueryClient();

  const mutation = useMutation<Problem, Error, Problem, Context>({
    mutationFn: upsertProblem,

    onMutate: async (newProblem) => {
      // 1) stop any in‑flight refetches for this problem
      await queryClient.cancelQueries({
        queryKey: [GET_SINGLE_PROBLEM_QUERY_KEY_PREFIX, newProblem.id],
      });

      // 2) snapshot the current problem from cache
      const previous = queryClient.getQueryData<Problem>([
        GET_SINGLE_PROBLEM_QUERY_KEY_PREFIX,
        newProblem.id,
      ]);

      // 3) update the cache with the new problem
      queryClient.setQueryData([GET_SINGLE_PROBLEM_QUERY_KEY_PREFIX, newProblem.id], newProblem);

      // 4) return the previous problem
      return { previous };
    },

    onError: (err, newProblem, context) => {
      // if we have a previous snapshot, restore it
      console.log('Error upserting problem:', err.message);
      if (context?.previous) {
        queryClient.setQueryData(
          [GET_SINGLE_PROBLEM_QUERY_KEY_PREFIX, newProblem.id],
          context.previous,
        );
      }
    },

    onSettled: (data, error, variables) => {
      // whether success or failure, refetch latest from server
      queryClient.invalidateQueries({
        queryKey: [GET_SINGLE_PROBLEM_QUERY_KEY_PREFIX, variables.id],
      });
    },
  });

  return {
    upsertProblem: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  };
}
