'use client';

import { useParams } from 'next/navigation';

export default function ChallengeInterface() {
  const params = useParams();
  return (
    <div className="min-h-screen bg-white p-6 md:p-8">
      <h1>Challenge {params.id}</h1>
    </div>
  );
}
