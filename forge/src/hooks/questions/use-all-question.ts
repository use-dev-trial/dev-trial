'use client';

import { useEffect, useState } from 'react';

import { getQuestionById, getQuestionsByChallengeId } from '@/actions/questions';
import { useQuery } from '@tanstack/react-query';

import { Question } from '@/types/questions';

interface UseAllQuestionsOptions {
  challengeId: string;
}

export function useAllQuestions(options: UseAllQuestionsOptions) {
  const { challengeId } = options;
  const [detailedQuestions, setDetailedQuestions] = useState<Question[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState<boolean>(false);

  const {
    data: questions,
    isLoading: isLoadingInitial,
    error,
  } = useQuery<Question[]>({
    queryKey: ['questions', 'challenge', challengeId],
    queryFn: () => getQuestionsByChallengeId(challengeId),
    enabled: !!challengeId,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const fetchDetailedQuestions = async () => {
      if (questions && questions.length > 0) {
        setIsLoadingDetails(true);
        try {
          const detailedQuestionsPromises = questions.map((question) =>
            getQuestionById(question.id),
          );
          const fetchedDetailedQuestions = await Promise.all(detailedQuestionsPromises);
          setDetailedQuestions(fetchedDetailedQuestions);
        } catch (error) {
          console.error('Error fetching detailed questions:', error);
        } finally {
          setIsLoadingDetails(false);
        }
      }
    };

    fetchDetailedQuestions();
  }, [questions]);

  return {
    questions: detailedQuestions,
    isLoading: isLoadingInitial || isLoadingDetails,
    error: error as Error | null,
  };
}
