import { AppSidebar } from '@/components/app-sidebar';
import { CustomSidebarTrigger } from '@/components/custom-sidebar-trigger';
import { QueryProvider } from '@/components/providers/query';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryProvider>
      <SidebarProvider>
        <AppSidebar />
        <div className="flex w-full flex-col peer-data-[state=collapsed]:pl-10">
          <CustomSidebarTrigger location="layout" />
          {children}
        </div>
      </SidebarProvider>
    </QueryProvider>
  );
}
