'use client';

import Link from 'next/link';

import useChallenge from '@/hooks/use-challenge';
import { Plus } from 'lucide-react';

import { ChallengeCard } from '@/components/challenges/card';
import { Card } from '@/components/ui/card';

import { CHALLENGE_CARD_GRADIENTS, ROUTES } from '@/lib/constants';
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
            <div className="mb-6 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
                <Plus className="h-7 w-7 text-blue-600" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-blue-800">No challenges yet</h3>
            <p className="mt-2 mb-6 text-blue-700">Create your first challenge to get started.</p>
            <Link
              href={ROUTES.QUESTIONS('1')}
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
            >
              Create Challenge
            </Link>
          </div>
        )}

        {!isLoading && challenges.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Create Challenge Card */}
            <Link href={ROUTES.QUESTIONS('1')} className="block h-full">
              <Card className="flex h-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-gray-300 p-6 text-center transition-all duration-300 hover:border-blue-500 hover:bg-blue-50 hover:shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <Plus className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="mb-1 text-lg font-medium">Create Challenge</h3>
                <p className="text-sm text-gray-500">Build a new coding challenge</p>
              </Card>
            </Link>

            {challenges.map((challenge, index) => (
              <ChallengeCard
                key={challenge.id}
                challenge={{
                  id: challenge.id,
                  name: challenge.name,
                  description: challenge.description,
                  url: ROUTES.CHALLENGES_DETAIL(challenge.id),
                  date: formatDate(),
                  gradient: CHALLENGE_CARD_GRADIENTS[index % CHALLENGE_CARD_GRADIENTS.length],
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
