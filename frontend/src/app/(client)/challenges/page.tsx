'use client';

import useChallenge from '@/hooks/use-challenge';

import { ChallengeCard } from '@/components/challenges/card';

import { CLIENT_ROUTES, GRADIENTS } from '@/lib/constants';
import { formatDate } from '@/lib/utils';

export default function ChallengePage() {
  const { challenges, isLoading, error } = useChallenge();

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <h1 className="mb-2 text-2xl font-semibold md:text-3xl">Challenges Library</h1>
          <p className="max-w-3xl">
            Share coding challenges with your candidates and stack rank them.
          </p>
        </header>

        {isLoading && (
          <div className="flex items-center justify-center py-10">
            <div className="h-6 w-6 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-2">Loading challenges...</span>
          </div>
        )}

        {error && (
          <div className="rounded-md bg-red-50 p-4 text-red-800">
            <p>Error loading challenges. Please try again later.</p>
            <p className="text-sm">{error.message}</p>
          </div>
        )}

        {!isLoading && !error && challenges.length === 0 && (
          <div className="rounded-md bg-blue-50 p-6 text-center">
            <h3 className="text-lg font-medium text-blue-800">No challenges yet</h3>
            <p className="mt-2 text-blue-700">Create your first challenge to get started.</p>
          </div>
        )}

        {!isLoading && challenges.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {challenges.map((challenge, index) => (
              <ChallengeCard
                key={challenge.id}
                challenge={{
                  id: challenge.id,
                  name: challenge.name,
                  description: challenge.description,
                  url: CLIENT_ROUTES.CHALLENGES_DETAIL(challenge.id),
                  date: formatDate(),
                  gradient: GRADIENTS[index % GRADIENTS.length],
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
