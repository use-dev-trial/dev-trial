'use client';

import { useEffect, useState } from 'react';

import { runTests } from '@/actions/questions';
import { Play } from 'lucide-react';

import { RunTestsInput, TestCase } from '@/types/questions';

import { cn } from '@/lib/utils';

interface TestSectionProps {
  height: number;
  isVerticalDragging?: boolean;
  testCases?: TestCase[];
  questionId: string;
  getCode: () => string;
}

export function TestSection({
  height,
  isVerticalDragging,
  testCases = [],
  questionId,
  getCode,
}: TestSectionProps) {
  const [activeTestIndex, setActiveTestIndex] = useState(0);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [output, setOutput] = useState<string | null>(null);

  // Reset active test index when test cases change
  useEffect(() => {
    if (testCases && testCases.length > 0) {
      setActiveTestIndex(0);
    }
  }, [testCases]);

  const currentTest = testCases[activeTestIndex] || {
    id: '',
    description: '',
    input: '',
    expected_output: '',
  };

  const handleRunTests = async () => {
    try {
      setIsRunningTests(true);
      setOutput(null);

      const code = getCode();
      const input: RunTestsInput = { code };

      const result = await runTests(questionId, input);
      setOutput(result);

      // Note: The current implementation of runTests doesn't return results
      // In a real implementation, you would receive and display the actual test results
      // setOutput('Tests completed. Check console for details.');
    } catch (error) {
      console.error('Error running tests:', error);
      setOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    } finally {
      setIsRunningTests(false);
    }
  };

  return (
    <div
      className={cn('flex h-full flex-col overflow-hidden', isVerticalDragging && 'select-none')}
      style={{ height: `${height}%` }}
    >
      <div className="border-border border-b px-4 py-2">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-foreground font-medium">Tests</div>
          <button
            className={cn(
              'flex items-center gap-1 rounded px-3 py-1 text-sm',
              isRunningTests
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'bg-primary text-primary-foreground hover:bg-primary/90',
            )}
            onClick={handleRunTests}
            disabled={isRunningTests}
          >
            {isRunningTests ? 'Running...' : 'Run'} <Play className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="flex gap-2">
          {testCases.map((testCase, index) => (
            <div
              key={testCase.id}
              className={cn(
                'cursor-pointer rounded px-3 py-1 text-xs',
                activeTestIndex === index
                  ? 'bg-background text-foreground border border-gray-300'
                  : 'bg-muted text-muted-foreground',
              )}
              onClick={() => setActiveTestIndex(index)}
            >
              Test {index + 1}
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-auto p-3">
        <div className="grid h-full grid-cols-3 gap-3">
          {/* Input Section */}
          <div className="flex h-full flex-col">
            <div className="text-foreground mb-1 text-xs font-medium">Input</div>
            <div className="bg-background border-border flex-1 overflow-auto rounded border p-2 text-sm text-blue-400">
              {currentTest.input || `No input for test ${activeTestIndex + 1}`}
            </div>
          </div>

          {/* Expected Output Section */}
          <div className="flex h-full flex-col">
            <div className="text-foreground mb-1 text-xs font-medium">Expected Output</div>
            <div className="bg-background border-border flex-1 overflow-auto rounded border p-2 text-sm text-blue-400">
              {currentTest.expected_output || `No expected output for test ${activeTestIndex + 1}`}
            </div>
          </div>

          {/* Actual Output Section */}
          <div className="flex h-full flex-col">
            <div className="text-foreground mb-1 text-xs font-medium">Output</div>
            <div className="bg-background border-border flex-1 overflow-auto rounded border p-2 text-sm text-blue-400">
              {output !== null ? output : '"No Output"'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
