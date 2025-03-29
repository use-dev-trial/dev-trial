import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { ClerkProvider } from '@clerk/nextjs';

import { AppSidebar } from '@/components/app-sidebar';
import { CustomSidebarTrigger } from '@/components/custom-sidebar-trigger';
import { QueryProvider } from '@/components/providers/query';
import { SidebarProvider } from '@/components/ui/sidebar';

import '../globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'DevTrial',
  description: 'DevTrial',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <QueryProvider>
            <SidebarProvider>
              <AppSidebar />
              <div className="flex w-full flex-col peer-data-[state=collapsed]:pl-10">
                <CustomSidebarTrigger location="layout" />
                {children}
              </div>
            </SidebarProvider>
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
