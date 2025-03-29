import { OrganizationSwitcher, UserButton } from '@clerk/nextjs';
import { Inbox, Plus, Settings } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

import { CustomSidebarTrigger } from './custom-sidebar-trigger';

const items = [
  {
    title: 'Create Challenge',
    url: '/create-challenge',
    icon: Plus,
  },
  {
    title: 'Challenges',
    url: '/challenges',
    icon: Inbox,
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent className="flex h-full flex-col">
        <SidebarGroup className="flex h-full flex-col">
          <div className="mb-5 flex items-center justify-between">
            <SidebarGroupLabel className="mb-0 p-3 text-lg font-bold text-blue-700">
              Dev Trial
            </SidebarGroupLabel>
            <CustomSidebarTrigger location="sidebar" />
          </div>
          <div className="flex min-h-0 flex-1 flex-col">
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </div>
          <div className="mt-auto flex items-center justify-between p-4">
            <OrganizationSwitcher />
            <UserButton />
          </div>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
