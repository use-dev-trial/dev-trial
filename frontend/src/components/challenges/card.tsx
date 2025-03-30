'use client';

import { useState } from 'react';

import { Check, Copy } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { cn } from '@/lib/utils';

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
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(challenge.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="overflow-hidden rounded-md border border-gray-200 transition-all duration-300 hover:shadow-md">
      <div className="p-5">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br',
                challenge.gradient,
              )}
            >
              <span className="text-sm font-medium text-white">{challenge.name.charAt(0)}</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-800">{challenge.name}</h3>
              <p className="text-xs text-gray-500">{challenge.date}</p>
            </div>
          </div>

          <Button
            onClick={copyToClipboard}
            className="green:border-green-500 green:bg-green-800 green:text-white green:hover:bg-green-700 rounded-md border border-gray-300 bg-white p-1.5 text-black transition-colors hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
            aria-label="Copy URL"
          >
            {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>

        <CardContent className="p-0">
          <p className="line-clamp-3 text-sm text-gray-600">{challenge.description}</p>

          <div className="mt-4 border-t border-gray-100 pt-3">
            <a
              href={`/challenges/${challenge.id}`}
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
              rel="noopener noreferrer"
            >
              View Challenge
              <svg
                className="ml-1 h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </a>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
