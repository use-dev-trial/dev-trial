import { useEffect, useState } from 'react';

import { Clock } from 'lucide-react';

import { ThemeToggle } from '@/components/shared/theme-toggle';

import { formatTime as formatTimeUtil } from '@/lib/utils';

interface TopBarProps {
  questionCount: number;
  initialTime?: number; // Optional prop to set initial time
  currentQuestionIndex: number;
  onNextQuestion: () => void;
}

export function TopBar({
  questionCount,
  initialTime = 3600,
  currentQuestionIndex,
  onNextQuestion,
}: TopBarProps) {
  const [remainingTime, setRemainingTime] = useState(initialTime);
  const [timerActive] = useState(true);

  // Handle countdown timer
  useEffect(() => {
    if (!timerActive) return;

    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerActive]);

  // Determine if current question is the last one
  const isLastQuestion = currentQuestionIndex === questionCount - 1;
  const buttonText = isLastQuestion ? 'Submit' : 'Next';

  return (
    <header className="border-border bg-background flex items-center justify-between border-b px-4 py-4">
      <div className="flex items-center gap-2">
        <h1 className="text-foreground text-xl font-bold">Dev Trial Arena</h1>
        <Clock className="text-muted-foreground ml-2 h-4 w-4" />
        <span className="text-muted-foreground ml-2 font-mono">
          {formatTimeUtil(remainingTime)}
        </span>
      </div>
      <p>Challenge Name</p>
      <div className="flex items-center gap-2">
        <p className="text-muted-foreground mr-2">
          Question {currentQuestionIndex + 1} of {questionCount}
        </p>
        <button
          className="rounded-md bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
          onClick={onNextQuestion}
        >
          {buttonText}
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
}
