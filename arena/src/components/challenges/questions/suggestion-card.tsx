'use client';

import React from 'react';

import { Button } from '@/components/ui/button';

interface SuggestionCardProps {
  message: string;
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  children: React.ReactNode;
}

export default function SuggestionCard({
  message,
  onSendMessage,
  isLoading = false,
  children,
}: SuggestionCardProps) {
  return (
    <Button
      variant="outline"
      className="h-auto w-full justify-start border border-blue-500 py-3 text-left text-sm font-normal whitespace-normal transition-colors hover:bg-blue-50"
      onClick={() => onSendMessage(message)}
      disabled={isLoading}
    >
      {children}
    </Button>
  );
}
