'use client';

import { useEffect } from 'react';

import { useMetrics } from '@/hooks/use-metrics';

export default function SettingsPage() {
  const { upsertMetrics, isPending, error } = useMetrics();
  useEffect(() => {
    upsertMetrics({
      id: '', // metric id (empty string if it is a fresh insert, actual id if it is an update)
      question_id: '3c19f3aa-f2cb-4366-9913-3170d4f8a248', // question id
      metric: 'Candidate code is well-formatted',
    });
  }, []);
  console.log('isPending', isPending);
  console.log('error', error);
  return <div>Settings</div>;
}
