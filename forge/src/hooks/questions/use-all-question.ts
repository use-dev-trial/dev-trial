'use client';

import { getQuestionsByChallengeId } from '@/actions/questions';
import { useQuery } from '@tanstack/react-query';

import { Question } from '@/types/questions';

export function useAllQuestions(challenge_id: string) {
  const {
    data: questions,
    isLoading,
    refetch,
  } = useQuery<Question[]>({
    queryKey: ['questions', 'challenge', challenge_id],
    queryFn: () => getQuestionsByChallengeId(challenge_id),
    enabled: !!challenge_id,
    refetchOnWindowFocus: false,
  });

  return {
    questions: questions ?? [],
    isLoading,
    refetch,
  };
}
