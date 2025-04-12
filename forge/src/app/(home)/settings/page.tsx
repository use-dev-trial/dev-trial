'use client';

import { useEffect } from 'react';

import { useMetrics } from '@/hooks/use-metrics';

export default function SettingsPage() {
  const { upsertMetrics, isPending, error } = useMetrics();
  useEffect(() => {
    upsertMetrics({
      id: '3c19f3aa-f2cb-4366-9913-3170d4f8a248', // question id
      metrics: ['Candidate code is well-formatted', 'Candidate code is well-structured'],
    });
  }, []);
  console.log('isPending', isPending);
  console.log('error', error);
  return <div>Settings</div>;
}
