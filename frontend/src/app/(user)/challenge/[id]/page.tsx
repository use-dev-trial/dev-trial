'use client';

import { useParams } from 'next/navigation';

export default function ChallengeInterface() {
  const params = useParams();
  return (
    <div>
      <h1>Challenge {params.id}</h1>
    </div>
  );
}
