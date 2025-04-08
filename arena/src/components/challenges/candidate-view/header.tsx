import { Clock } from 'lucide-react';

import { ThemeToggle } from '@/components/shared/theme-toggle';

interface TopBarProps {
  remainingTime: number;
  formatTime: (seconds: number) => string;
}

export function TopBar({ remainingTime, formatTime }: TopBarProps) {
  return (
    <header className="border-border bg-background flex items-center justify-between border-b px-4 py-2">
      <div className="flex items-center gap-2">
        <h1 className="text-foreground text-xl font-bold">Code Review Feedback</h1>
      </div>
      <div className="flex items-center gap-2">
        <Clock className="text-muted-foreground h-4 w-4" />
        <span className="text-muted-foreground mr-4 font-mono">{formatTime(remainingTime)}</span>
        <ThemeToggle />
      </div>
    </header>
  );
}
