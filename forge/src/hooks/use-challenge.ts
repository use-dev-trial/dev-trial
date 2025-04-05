'use client';

import { createChallenge, getAllChallenges, getChallenge } from '@/actions/challenges';
import { UseMutationResult, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Challenge, CreateChallengeRequest } from '@/types/challenges';

interface useChallengeOptions {
  challenges: Challenge[] | [];
  isLoading: boolean;
  error: Error | null;
  createChallengeMutation: UseMutationResult<Challenge, Error, CreateChallengeRequest, unknown>;

  // Single challenge data
  challenge: Challenge | null;
  isChallengeLoading: boolean;
  challengeError: Error | null;
}

export default function useChallenge(challengeId?: string): useChallengeOptions {
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery<Challenge[]>({
    queryKey: ['challenges'],
    queryFn: () => getAllChallenges().then((response) => response.challenges),
    refetchOnWindowFocus: false,
  });

  const {
    data: challenge,
    isLoading: isChallengeLoading,
    error: challengeError,
  } = useQuery<Challenge>({
    queryKey: ['challenge', challengeId],
    queryFn: () => getChallenge(challengeId as string),
    enabled: !!challengeId,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const createMutation = useMutation({
    mutationFn: (challengeParams: CreateChallengeRequest) => createChallenge(challengeParams),
    mutationKey: ['createChallenge'],
    onError: (err) => {
      console.error('Error creating challenge:', err.message);
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
    challenge: challenge || null,
    isChallengeLoading,
    challengeError: challengeError as Error | null,
  };
}
