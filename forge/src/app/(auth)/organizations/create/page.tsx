'use client';

import { useTheme } from 'next-themes';

import { CreateOrganization } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

export default function OrganizationSwitcherPage() {
  const { theme } = useTheme();

  return (
    <div className="bg-background text-foreground flex min-h-screen items-center justify-center">
      <CreateOrganization
        appearance={{
          baseTheme: theme === 'dark' ? dark : undefined,
        }}
      />
    </div>
  );
}
