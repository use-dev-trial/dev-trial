'use client';

import { useState } from 'react';

import { cn } from '@/lib/utils';

interface TestSectionProps {
  height: number;
  isVerticalDragging?: boolean;
}

export function TestSection({ height, isVerticalDragging }: TestSectionProps) {
  const [activePreviewTab, setActivePreviewTab] = useState('Preview');

  return (
    <div
      className={cn('flex h-full flex-col overflow-hidden', isVerticalDragging && 'select-none')}
      style={{ height: `${height}%` }}
    >
      {/* Preview Tabs */}
      <div className="border-border border-b">
        <div className="flex">
          <div
            className={cn(
              'cursor-pointer px-4 py-2 text-sm',
              activePreviewTab === 'Preview'
                ? 'border-primary text-foreground border-b-2 font-medium'
                : 'text-muted-foreground',
            )}
            onClick={() => setActivePreviewTab('Preview')}
          >
            Preview
          </div>
          <div
            className={cn(
              'cursor-pointer px-4 py-2 text-sm',
              activePreviewTab === 'Tests'
                ? 'border-primary text-foreground border-b-2 font-medium'
                : 'text-muted-foreground',
            )}
            onClick={() => setActivePreviewTab('Tests')}
          >
            Tests
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="border-border flex-1 overflow-auto border-b">
        {activePreviewTab === 'Preview' && (
          <div className="h-full p-4">
            <div className="bg-muted mb-4 p-4">
              <h1 className="text-foreground text-xl">Code Review Feedback</h1>
            </div>
            <div className="border-border bg-background rounded-lg border p-6 shadow-sm">
              <h2 className="text-foreground mb-4 text-xl font-semibold">Readability</h2>
              <div className="mb-6 flex justify-around">
                <button className="flex items-center justify-center gap-2 rounded-md bg-green-500 px-4 py-2 text-white">
                  👍 Upvote
                </button>
                <button className="flex items-center justify-center gap-2 rounded-md bg-red-500 px-4 py-2 text-white">
                  👎 Downvote
                </button>
              </div>
              <div className="text-muted-foreground space-y-1 text-center">
                <p>
                  Upvotes: <strong>0</strong>
                </p>
                <p>
                  Downvotes: <strong>0</strong>
                </p>
              </div>
            </div>
          </div>
        )}
        {activePreviewTab === 'Tests' && (
          <div className="h-full p-4">
            <div className="text-muted-foreground text-sm">No tests have been run yet.</div>
          </div>
        )}
      </div>
    </div>
  );
}
