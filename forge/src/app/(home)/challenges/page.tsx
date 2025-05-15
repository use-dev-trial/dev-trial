'use client';

import { useRouter } from 'next/navigation';

import { useEffect, useState } from 'react';

import { createTemplateQuestion } from '@/actions/questions';
import { useCreateChallenge } from '@/hooks/challenges/mutation/create';
import { useGetAllChallenges } from '@/hooks/challenges/read/all';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import { ChallengeCard } from '@/components/challenges/card';
import CreateChallengeDialog from '@/components/challenges/create-challenge-dialog';
import Loader from '@/components/shared/loader';
import { Card } from '@/components/ui/card';

import { Challenge, createChallengeRequestSchema } from '@/types/challenges';
import { createTemplateQuestionRequestSchema } from '@/types/questions';

import { CHALLENGE_CARD_GRADIENTS, ROUTES } from '@/lib/constants';
import { formatDate } from '@/lib/utils';

export default function ChallengePage() {
  const router = useRouter();

  const {
    challenges,
    isLoading: isLoadingChallenges,
    error: loadingChallengesError,
  } = useGetAllChallenges();
  const { createChallenge, error: creatingChallengeError } = useCreateChallenge();

  const [isCreatingChallenge, setIsCreatingChallenge] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateChallengeDialogOpen, setIsCreateChallengeDialogOpen] = useState(false);

  useEffect(() => {
    if (isLoadingChallenges || isCreatingChallenge) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isLoadingChallenges, isCreatingChallenge]);

  const onCreateChallengeDialogToggle = () => {
    setIsCreateChallengeDialogOpen(
      (prevIsCreateChallengeDialogOpen) => !prevIsCreateChallengeDialogOpen,
    );
  };

  const onCreateChallengeBtnClick = async (challengeName: string, challengeDescription: string) => {
    if (!challengeName.trim() || !challengeDescription.trim() || isLoading) {
      return;
    }

    setIsCreatingChallenge(true);

    const createChallengeRequest = createChallengeRequestSchema.parse({
      name: challengeName.trim(),
      description: challengeDescription.trim(),
    });

    try {
      const createdChallenge: Challenge = await createChallenge(createChallengeRequest);
      const createTemplateQuestionRequest = createTemplateQuestionRequestSchema.parse({
        challenge_id: createdChallenge.id,
      });
      await createTemplateQuestion(createTemplateQuestionRequest);
      onCreateChallengeDialogToggle();
      router.push(ROUTES.QUESTIONS(createdChallenge.id));
    } catch {
      toast("We couldn't create your challenge. Please try again later.");
    } finally {
      setIsCreatingChallenge(false);
    }
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

        {isLoadingChallenges && <Loader text="Loading challenges" />}
        {isCreatingChallenge && <Loader text="Creating challenge" />}

        {loadingChallengesError && (
          <div className="rounded-md bg-red-50 p-4 text-red-800">
            <p>Error loading challenges. Please try again later.</p>
            <p className="text-sm">{loadingChallengesError.message}</p>
          </div>
        )}

        {!isLoading && !loadingChallengesError && challenges.length === 0 && (
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
        isLoading={isCreatingChallenge}
        error={creatingChallengeError}
        onOpenChange={onCreateChallengeDialogToggle}
        onCreateChallengeBtnClick={onCreateChallengeBtnClick}
      />
    </div>
  );
}
