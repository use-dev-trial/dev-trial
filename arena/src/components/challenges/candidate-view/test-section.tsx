'use client';

import { useEffect, useState } from 'react';

import { Play } from 'lucide-react';

import { TestCase } from '@/types/questions';

import { cn } from '@/lib/utils';

interface TestSectionProps {
  height: number;
  isVerticalDragging?: boolean;
  testCases?: TestCase[];
}

export function TestSection({ height, isVerticalDragging, testCases }: TestSectionProps) {
  const [activeTest, setActiveTest] = useState(1);
  const [formattedTestCases, setFormattedTestCases] = useState<
    Record<
      number,
      {
        input: string;
        expectedOutput: string;
      }
    >
  >({});

  // Default test cases data if none provided
  const defaultTestCases = {
    1: {
      input: `{"a":true,"b":false,"c":null}`,
      expectedOutput: 'true',
    },
    2: {
      input: `{"x":42,"y":"test","z":false}`,
      expectedOutput: '42',
    },
    3: {
      input: `{"data":[1,2,3],"valid":true}`,
      expectedOutput: '[1,2,3]',
    },
    4: {
      input: `{"config":{"debug":true,"mode":"test"}}`,
      expectedOutput: '{"debug":true,"mode":"test"}',
    },
  };

  // Initialize test cases based on provided data or defaults
  useEffect(() => {
    if (testCases && testCases.length > 0) {
      const formattedCases: Record<number, { input: string; expectedOutput: string }> = {};
      testCases.forEach((testCase, index) => {
        formattedCases[index + 1] = {
          input: testCase.description || `Test Case ${index + 1}`,
          expectedOutput: 'Expected result',
        };
      });
      setFormattedTestCases(formattedCases);
      setActiveTest(1);
    } else {
      setFormattedTestCases(defaultTestCases);
      setActiveTest(1);
    }
  }, [testCases]);

  const testNumbers = Object.keys(formattedTestCases).map(Number);
  const currentTest = formattedTestCases[activeTest] || { input: '', expectedOutput: '' };

  return (
    <div
      className={cn('flex h-full flex-col overflow-hidden', isVerticalDragging && 'select-none')}
      style={{ height: `${height}%` }}
    >
      {/* Tests Header */}
      <div className="border-border flex items-center justify-between border-b px-4 py-2">
        <div className="text-foreground font-medium">Tests</div>
        <button className="bg-primary text-primary-foreground flex items-center gap-1 rounded px-3 py-1 text-sm">
          Run <Play className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Test Tabs */}
      <div className="border-border flex gap-2 border-b p-2">
        {testNumbers.map((testNum) => (
          <div
            key={testNum}
            className={cn(
              'cursor-pointer rounded px-4 py-1 text-sm',
              activeTest === testNum
                ? 'bg-background text-foreground border border-gray-300'
                : 'bg-muted text-muted-foreground',
            )}
            onClick={() => setActiveTest(testNum)}
          >
            Test {testNum}
          </div>
        ))}
      </div>

      {/* Main content area */}
      <div className="grid grid-cols-2 gap-4 p-4">
        {/* Input Section */}
        <div>
          <div className="text-foreground mb-1 text-sm font-medium">Input</div>
          <div className="bg-background border-border h-12 rounded border p-3 text-sm text-blue-400">
            {currentTest.input}
          </div>
        </div>

        {/* Expected Output Section */}
        <div>
          <div className="text-foreground mb-1 text-sm font-medium">Expected Output</div>
          <div className="bg-background border-border h-12 rounded border p-3 text-sm text-blue-400">
            {currentTest.expectedOutput}
          </div>
        </div>
      </div>

      {/* Output Section */}
      <div className="px-4 pb-4">
        <div className="text-foreground mb-1 text-sm font-medium">Output</div>
        <div className="bg-background border-border rounded border p-3 text-sm text-blue-400">
          &quot;No Output&quot;
        </div>
      </div>
    </div>
  );
}
