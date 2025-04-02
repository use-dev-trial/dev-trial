'use client';

import { useEffect, useState } from 'react';

import { PanelLeftIcon } from 'lucide-react';

import { Button } from './ui/button';
import { useSidebar } from './ui/sidebar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

type CustomSidebarTriggerProps = {
  location?: 'sidebar' | 'layout';
};

export function CustomSidebarTrigger({ location = 'sidebar' }: CustomSidebarTriggerProps) {
  const { toggleSidebar, state } = useSidebar();
  const [isMounted, setIsMounted] = useState(false);

  // Only show after component has mounted on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render anything during SSR or until mounted
  if (!isMounted) {
    return null;
  }

  // In sidebar: only show when expanded
  // In layout: only show when collapsed
  if (
    (location === 'sidebar' && state === 'collapsed') ||
    (location === 'layout' && state === 'expanded')
  ) {
    return null;
  }

  if (location === 'layout') {
    return (
      <div className="fixed top-0 left-0 z-40 flex h-screen w-10 flex-col items-center border-r py-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div data-sidebar="trigger" onClick={toggleSidebar}>
                <PanelLeftIcon size={16} />
                <span className="sr-only">Toggle Sidebar</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="flex items-center justify-center">
              <p className="mr-8 text-sm">Toggle Sidebar</p>
              <kbd className="pointer-events-none absolute top-[0.3rem] right-[0.3rem] ml-4 hidden h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none sm:flex">
                <span className="text-xs">⌘</span>B
              </kbd>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div data-sidebar="trigger" onClick={toggleSidebar}>
            <PanelLeftIcon size={16} />
            <span className="sr-only">Toggle Sidebar</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" className="flex items-center justify-center">
          <p className="mr-8 text-sm">Toggle Sidebar</p>
          <kbd className="pointer-events-none absolute top-[0.3rem] right-[0.3rem] ml-4 hidden h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none sm:flex">
            <span className="text-xs">⌘</span>B
          </kbd>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
