import { Inbox, Plus, Settings } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

import { CustomSidebarTrigger } from './custom-sidebar-trigger';

// Menu items.
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
      <SidebarContent>
        <SidebarGroup>
          <div className="mb-5 flex items-center justify-between">
            <SidebarGroupLabel className="mb-0 text-lg font-bold">Dev Trials</SidebarGroupLabel>
            <CustomSidebarTrigger location="sidebar" />
          </div>
          <SidebarGroupContent>
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
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
