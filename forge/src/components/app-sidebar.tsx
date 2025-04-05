'use client';

import { useTheme } from 'next-themes';
import Link from 'next/link';

import { useEffect } from 'react';

import {
  OrganizationSwitcher,
  UserButton,
  useOrganization,
  useOrganizationList,
  useSession,
} from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { Inbox, Settings } from 'lucide-react';

import { ThemeToggle } from '@/components/shared/theme-toggle';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

import { ROUTES } from '@/lib/constants';

import { CustomSidebarTrigger } from './custom-sidebar-trigger';

const items = [
  {
    title: 'Challenges',
    url: ROUTES.CHALLENGES,
    icon: Inbox,
  },
  {
    title: 'Settings',
    url: ROUTES.SETTINGS,
    icon: Settings,
  },
];

export function AppSidebar() {
  const { theme } = useTheme();
  const { session, isLoaded: isSessionLoaded } = useSession();
  const { isLoaded: isOrgLoaded } = useOrganization();
  const { isLoaded: isOrgListLoaded, setActive } = useOrganizationList();

  useEffect(() => {
    if (!isSessionLoaded || !isOrgLoaded || !isOrgListLoaded || !session) return;
    const hasActiveOrg = session.user;
    const availableOrgs = session.user.organizationMemberships;
    if (!hasActiveOrg && availableOrgs.length > 0) {
      void setActive({ organization: availableOrgs[0].id });
    }
  }, [isSessionLoaded, isOrgListLoaded, setActive]);

  return (
    <Sidebar>
      <SidebarContent className="flex h-full flex-col">
        <SidebarGroup className="flex h-full flex-col">
          <div className="mb-5 flex items-center justify-between">
            <SidebarGroupLabel className="mb-0 p-3 text-lg font-bold text-blue-600 dark:text-blue-300">
              Dev Trial
            </SidebarGroupLabel>
            <div>
              <ThemeToggle />
              <CustomSidebarTrigger location="sidebar" />
            </div>
          </div>
          <div className="flex min-h-0 flex-1 flex-col">
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </div>
          <div className="mt-auto flex items-center justify-between p-4">
            <OrganizationSwitcher
              appearance={{
                baseTheme: theme === 'dark' ? dark : undefined,
              }}
              hidePersonal // ✅ hides the "personal account" option
            />
            <UserButton />
          </div>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
