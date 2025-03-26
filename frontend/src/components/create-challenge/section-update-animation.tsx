'use client';

import type React from 'react';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

interface SectionUpdateAnimationProps {
  children: React.ReactNode;
  className?: string;
  updated?: boolean;
}

export default function SectionUpdateAnimation({
  children,
  className,
  updated = false,
}: SectionUpdateAnimationProps) {
  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    if (updated) {
      setIsUpdated(true);
      const timer = setTimeout(() => {
        setIsUpdated(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [updated]);

  return (
    <div
      className={cn(
        'transition-all duration-500',
        isUpdated && 'border-l-4 border-green-500 bg-green-50',
        className,
      )}
    >
      {children}
    </div>
  );
}
