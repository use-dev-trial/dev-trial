'use client';

import { useParams } from 'next/navigation';

import { useState } from 'react';

import useChallenge from '@/hooks/use-challenge';

import { ChallengeInterface } from '@/components/challenges/candidate-view/challenge-interface';
import { ChallengeIntro } from '@/components/challenges/candidate-view/challenge-intro';
import Loader from '@/components/shared/loader';

export default function ChallengeInterfacePage() {
  const params = useParams();
  const challengeId = params.id as string;
  const { challenge, isChallengeLoading } = useChallenge(challengeId);
  const [isStarted, setIsStarted] = useState(false);

  if (isChallengeLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader text={'challenge'} />
      </div>
    );
  }

  if (!challenge) {
    return <div className="flex h-screen items-center justify-center">Challenge not found</div>;
  }

  // Handle start button click
  const handleStart = () => {
    setIsStarted(true);
  };

  if (!isStarted) {
    return <ChallengeIntro challenge={challenge} onStart={handleStart} />;
  }

  return <ChallengeInterface challengeId={challengeId} challengeName={challenge.name} />;
}
