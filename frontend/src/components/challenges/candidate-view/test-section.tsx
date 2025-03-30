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
      <div className="border-b border-gray-200">
        <div className="flex">
          <div
            className={cn(
              'cursor-pointer px-4 py-2 text-sm',
              activePreviewTab === 'Preview'
                ? 'border-b-2 border-blue-500 font-medium'
                : 'text-gray-500',
            )}
            onClick={() => setActivePreviewTab('Preview')}
          >
            Preview
          </div>
          <div
            className={cn(
              'cursor-pointer px-4 py-2 text-sm',
              activePreviewTab === 'Tests'
                ? 'border-b-2 border-blue-500 font-medium'
                : 'text-gray-500',
            )}
            onClick={() => setActivePreviewTab('Tests')}
          >
            Tests
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-auto border-b border-gray-200">
        {activePreviewTab === 'Preview' && (
          <div className="h-full p-4">
            <div className="mb-4 bg-gray-900 p-4 text-green-400">
              <h1 className="text-xl">Code Review Feedback</h1>
            </div>
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold">Readability</h2>
              <div className="mb-6 flex justify-around">
                <button className="flex items-center justify-center gap-2 rounded-md bg-green-500 px-4 py-2 text-white">
                  👍 Upvote
                </button>
                <button className="flex items-center justify-center gap-2 rounded-md bg-red-500 px-4 py-2 text-white">
                  👎 Downvote
                </button>
              </div>
              <div className="space-y-1 text-center">
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
            <div className="text-sm text-gray-500">No tests have been run yet.</div>
          </div>
        )}
      </div>
    </div>
  );
}
