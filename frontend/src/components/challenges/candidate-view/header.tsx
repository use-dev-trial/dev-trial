import { Clock } from 'lucide-react';

import { ThemeToggle } from '@/components/shared/theme-toggle';

interface TopBarProps {
  remainingTime: number;
  formatTime: (seconds: number) => string;
}

export function TopBar({ remainingTime, formatTime }: TopBarProps) {
  return (
    <header className="flex items-center justify-between border-b border-gray-200 px-4 py-2 dark:border-gray-800">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold dark:text-white">Code Review Feedback</h1>
      </div>
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 dark:text-gray-300" />
        <span className="mr-4 font-mono dark:text-gray-300">{formatTime(remainingTime)}</span>
        <ThemeToggle />
      </div>
    </header>
  );
}
