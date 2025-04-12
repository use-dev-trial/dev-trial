'use client';

import { useRouter } from 'next/navigation';

import { Card, CardContent } from '@/components/ui/card';

import { ROUTES } from '@/lib/constants';

interface Challenge {
  id: string;
  name: string;
  url: string;
  date: string;
  description: string;
  gradient: string;
}

interface ChallengeCardProps {
  challenge: Challenge;
}

export function ChallengeCard({ challenge }: ChallengeCardProps) {
  const router = useRouter();
  return (
    <Card
      className="overflow-hidden rounded-md border transition-all duration-300 hover:cursor-pointer hover:shadow-md"
      onClick={() => router.push(ROUTES.CHALLENGES_DETAIL(challenge.id))}
    >
      <div className="p-5">
        <div className="mb-4 flex items-start justify-between">
          <h1 className="text-xl font-bold">{challenge.name}</h1>
          <p className="pt-2 text-xs italic">{challenge.date}</p>
        </div>

        <CardContent className="p-0">
          <p className="line-clamp-3 text-sm">{challenge.description}</p>
        </CardContent>
      </div>
    </Card>
  );
}
