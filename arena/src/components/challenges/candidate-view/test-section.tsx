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
  const [outputs, setOutputs] = useState<Record<number, string | null>>({});
  const [passedTests, setPassedTests] = useState<Record<number, boolean>>({});
  const [failedTests, setFailedTests] = useState<Record<number, boolean>>({});

  // Initialize test cases based on provided data or defaults
  useEffect(() => {
    if (testCases && testCases.length > 0) {
      const formattedCases: Record<number, { input: string; expectedOutput: string }> = {};
      testCases.forEach((testCase, index) => {
        formattedCases[index + 1] = {
          input: testCase.description || `Test Case ${index + 1}`,
          expectedOutput: 'Hello, Alice!',
        };
      });
      setFormattedTestCases(formattedCases);
      setActiveTest(1);
    } else {
      setActiveTest(1);
    }
  }, [testCases]);

  const testNumbers = Object.keys(formattedTestCases).map(Number);
  const currentTest = formattedTestCases[activeTest] || {
    input: '',
    expectedOutput: 'Hello, Alice!',
  };

  // Get the current test output
  const currentOutput = outputs[activeTest] || null;

  // Check if the current test has passed
  const hasCurrentTestPassed =
    currentOutput !== null && currentOutput === currentTest.expectedOutput;
  const hasCurrentTestFailed =
    currentOutput !== null && currentOutput !== currentTest.expectedOutput;

  const handleRunTests = async () => {
    try {
      setIsRunningTests(true);

      // Reset outputs and test status
      const initialOutputs: Record<number, string | null> = {};
      testNumbers.forEach((num) => {
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
          const testCase = formattedTestCases[testNum];
          if (result === testCase.expectedOutput) {
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
          {testNumbers.map((testNum) => (
            <div
              key={testNum}
              className={cn(
                'cursor-pointer rounded px-3 py-1 text-xs',
                activeTest === testNum
                  ? 'bg-background text-foreground border border-gray-300'
                  : 'bg-muted text-muted-foreground',
                passedTests[testNum] && 'border-green-500',
                failedTests[testNum] && 'border-red-500',
              )}
              onClick={() => setActiveTest(testNum)}
            >
              Test {testNum}
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
              {currentTest.input}
            </div>
          </div>

          {/* Expected Output Section */}
          <div className="flex h-full flex-col">
            <div className="text-foreground mb-1 text-xs font-medium">Expected Output</div>
            <div className="bg-background border-border flex-1 overflow-auto rounded border p-2 text-sm text-blue-400">
              {currentTest.expectedOutput}
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
