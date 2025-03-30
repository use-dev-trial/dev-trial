import { Clock } from 'lucide-react';

interface TopBarProps {
  remainingTime: number;
  formatTime: (seconds: number) => string;
}

export function TopBar({ remainingTime, formatTime }: TopBarProps) {
  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-2">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold">Code Review Feedback</h1>
      </div>
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4" />
        <span className="font-mono">{formatTime(remainingTime)}</span>
      </div>
    </header>
  );
}
