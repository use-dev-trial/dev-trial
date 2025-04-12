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
  testCases,
  questionId,
  getCode,
}: TestSectionProps) {
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
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [output, setOutput] = useState<string | null>(null);

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
      setActiveTest(1);
    }
  }, [testCases]);

  const testNumbers = Object.keys(formattedTestCases).map(Number);
  const currentTest = formattedTestCases[activeTest] || { input: '', expectedOutput: '' };

  const handleRunTests = async () => {
    try {
      setIsRunningTests(true);
      setOutput(null);

      const code = getCode();
      const input: RunTestsInput = { code };

      await runTests(questionId, input);

      // Note: The current implementation of runTests doesn't return results
      // In a real implementation, you would receive and display the actual test results
      setOutput('Tests completed. Check console for details.');
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
      {/* Tests Header */}
      <div className="border-border flex items-center justify-between border-b px-4 py-2">
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
          {output !== null ? output : '"No Output"'}
        </div>
      </div>
    </div>
  );
}
