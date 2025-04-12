'use client';

import { useState } from 'react';

import { useAllChallenges } from '@/hooks/challenges/use-all-challenges';
import { Plus } from 'lucide-react';

import { ChallengeCard } from '@/components/challenges/card';
import CreateChallengeDialog from '@/components/challenges/create-challenge-dialog';
import Loader from '@/components/shared/loader';
import { Card } from '@/components/ui/card';

import { CHALLENGE_CARD_GRADIENTS, ROUTES } from '@/lib/constants';
import { formatDate } from '@/lib/utils';

export default function ChallengePage() {
  const { challenges, isLoading, error } = useAllChallenges();
  const [isCreateChallengeDialogOpen, setIsCreateChallengeDialogOpen] = useState(false);

  const onCreateChallengeDialogToggle = () => {
    setIsCreateChallengeDialogOpen(
      (prevIsCreateChallengeDialogOpen) => !prevIsCreateChallengeDialogOpen,
    );
  };

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <h1 className="mb-2 text-2xl font-semibold md:text-3xl">Challenges Library</h1>
          <p className="max-w-3xl">
            Share coding challenges with your candidates and stack rank them.
          </p>
        </header>

        {isLoading && <Loader text="challenges" />}

        {error && (
          <div className="rounded-md bg-red-50 p-4 text-red-800">
            <p>Error loading challenges. Please try again later.</p>
            <p className="text-sm">{error.message}</p>
          </div>
        )}

        {!isLoading && !error && challenges.length === 0 && (
          <div className="rounded-md border-2 bg-white p-6 text-center dark:bg-gray-800">
            <h3 className="text-lg font-medium">No challenges yet</h3>
            <p className="mt-2 mb-6">Create your first challenge to get started.</p>

            <div className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
                <Plus
                  className="h-7 w-7 text-blue-600 hover:cursor-pointer"
                  onClick={onCreateChallengeDialogToggle}
                />
              </div>
            </div>
          </div>
        )}

        {!isLoading && challenges.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card
              className="hover:bg-blue-350 flex h-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-gray-300 p-6 text-center transition-all duration-300 hover:border-blue-500 hover:shadow-md"
              onClick={onCreateChallengeDialogToggle}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Plus className="h-7 w-7 text-blue-600 hover:cursor-pointer" />
              </div>
              <h3 className="mb-1 text-lg font-medium">Create Challenge</h3>
              <p className="text-sm text-gray-500">Build a new coding challenge</p>
            </Card>

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
      <CreateChallengeDialog
        isOpen={isCreateChallengeDialogOpen}
        onOpenChange={onCreateChallengeDialogToggle}
      />
    </div>
  );
}
