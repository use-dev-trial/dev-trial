'use client';

import type React from 'react';
import { useEffect, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

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
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [updated]);

  // Define animation variants for consistent positioning and no layout shifts
  const labelVariants = {
    hidden: { x: 30, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { x: 30, opacity: 0, transition: { duration: 0.3 } },
  };

  const contentVariants = {
    initial: {},
    animate: {
      boxShadow: [
        '0px 0px 0px rgba(0,0,0,0)',
        '0px 0px 4px rgba(34,197,94,0.25)',
        '0px 0px 0px rgba(0,0,0,0)',
      ],
      backgroundColor: ['rgba(255,255,255,1)', 'rgba(240,253,244,0.3)', 'rgba(255,255,255,1)'],
    },
  };

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <AnimatePresence>
        {isUpdated && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={labelVariants}
            className="absolute top-0 right-0 z-10 flex items-center gap-1 rounded-bl-md bg-green-100 px-3 py-1.5 text-xs font-medium text-green-800 shadow-sm"
          >
            <CheckCircle className="h-3.5 w-3.5" />
            <span>Updated</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={false}
        animate={isUpdated ? 'animate' : 'initial'}
        variants={contentVariants}
        transition={{
          duration: 1.8,
          ease: 'easeInOut',
          times: [0, 0.4, 1],
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
