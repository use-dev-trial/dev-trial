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
  const [outputs, setOutputs] = useState<Record<number, string | null>>({});
  const [passedTests, setPassedTests] = useState<Record<number, boolean>>({});
  const [failedTests, setFailedTests] = useState<Record<number, boolean>>({});

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

  // Get the current test output
  const currentOutput = outputs[activeTestIndex] || null;

  // Check if the current test has passed
  const hasCurrentTestPassed =
    currentOutput !== null && currentOutput === currentTest.expected_output;
  const hasCurrentTestFailed =
    currentOutput !== null && currentOutput !== currentTest.expected_output;

  const handleRunTests = async () => {
    try {
      setIsRunningTests(true);

      // Reset outputs and test status
      const initialOutputs: Record<number, string | null> = {};
      const testNumbers = Array.from({ length: testCases.length }, (_, i) => i);
      testNumbers.forEach((num: number) => {
        initialOutputs[num] = null;
      });
      setOutputs(initialOutputs);
      setPassedTests({});
      setFailedTests({});

      const code = getCode();
      const input: RunTestsInput = { code };

      // Run tests for all test cases
      const newOutputs: Record<number, string | null> = {};
      const newPassedTests: Record<number, boolean> = {};
      const newFailedTests: Record<number, boolean> = {};

      // In a real implementation, this would make separate calls for each test case
      // or receive results for all test cases at once
      for (const testNum of testNumbers) {
        try {
          const result = await runTests(questionId, input);
          newOutputs[testNum] = result;

          // Check if test passed or failed
          const testCase = testCases[testNum];
          if (result === testCase.expected_output) {
            newPassedTests[testNum] = true;
          } else {
            newFailedTests[testNum] = true;
          }
        } catch (error) {
          console.error(`Error running test ${testNum}:`, error);
          newOutputs[testNum] =
            `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`;
          newFailedTests[testNum] = true;
        }
      }

      setOutputs(newOutputs);
      setPassedTests(newPassedTests);
      setFailedTests(newFailedTests);
    } catch (error) {
      console.error('Error running tests:', error);
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
                passedTests[index] && 'border-green-500',
                failedTests[index] && 'border-red-500',
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
            <div
              className={cn(
                'bg-background flex-1 overflow-auto rounded border p-2 text-sm text-blue-400',
                hasCurrentTestPassed && 'border-green-500',
                hasCurrentTestFailed && 'border-red-500',
              )}
            >
              {currentOutput !== null ? currentOutput : '"No Output"'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
