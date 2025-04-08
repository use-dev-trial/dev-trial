import { Clock } from 'lucide-react';

import { ThemeToggle } from '@/components/shared/theme-toggle';

interface TopBarProps {
  remainingTime: number;
  formatTime: (seconds: number) => string;
}

export function TopBar({ remainingTime, formatTime }: TopBarProps) {
  return (
    <header className="border-border bg-background flex items-center justify-between border-b px-4 py-4">
      <div className="flex items-center gap-2">
        <h1 className="text-foreground text-xl font-bold">Dev Trial Arena</h1>
        <Clock className="text-muted-foreground ml-2 h-4 w-4" />
        <span className="text-muted-foreground ml-2 font-mono">{formatTime(remainingTime)}</span>
      </div>
      <p>Challenge Name</p>
      <div className="flex items-center gap-2">
        <p className="text-muted-foreground mr-2">Question 1 of 3</p>
        <button className="rounded-md bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700">
          Submit Code
          {/* If current question number is equal to total questions, show "Submit" button else show "Next" button */}
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
}
