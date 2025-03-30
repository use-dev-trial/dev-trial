'use client';

import { useEffect, useState } from 'react';

import { PanelLeftIcon } from 'lucide-react';

import { Button } from './ui/button';
import { useSidebar } from './ui/sidebar';

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
      <div className="fixed top-0 left-0 z-40 flex h-screen w-10 flex-col items-center border-r py-2">
        <Button
          variant="ghost"
          size="icon"
          data-sidebar="trigger"
          className="size-7"
          onClick={toggleSidebar}
        >
          <PanelLeftIcon />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      data-sidebar="trigger"
      className="size-7"
      onClick={toggleSidebar}
    >
      <PanelLeftIcon />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}
