'use client';

import { useEffect } from 'react';

import { useMetrics } from '@/hooks/use-metrics';

export default function SettingsPage() {
  const { upsertMetrics, isPending, error } = useMetrics();
  useEffect(() => {
    upsertMetrics({
      id: 'd954978b-2f2e-487b-af0e-955a6f1e2314', // metric id (empty string if it is a fresh insert, actual id if it is an update)
      question_id: '2e581ead-b38e-47e1-8bb3-993194b48dd3', // question id
      content: 'Candidate code is as good as the ones suveen write',
    });
  }, []);
  console.log('isPending', isPending);
  console.log('error', error);
  return <div>Settings</div>;
}
