'use client';

import { useParams } from 'next/navigation';

import { useState } from 'react';

import QuestionsTab from '@/components/challenges/home/questions-tab';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ChallengeInterface() {
  const [activeTab, setActiveTab] = useState('questions');
  const params = useParams();

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="mb-6 text-lg font-bold">Challenge {params.id}</h1>

      <Tabs
        defaultValue="questions"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="border-b">
          <TabsList className="h-12 bg-transparent">
            <TabsTrigger
              value="questions"
              className="data-[state=active]:border-b-primary h-12 rounded-none px-4 data-[state=active]:border-b-2"
            >
              Questions
            </TabsTrigger>
            <TabsTrigger
              value="responses"
              className="data-[state=active]:border-b-primary h-12 rounded-none px-4 data-[state=active]:border-b-2"
            >
              Responses
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:border-b-primary h-12 rounded-none px-4 data-[state=active]:border-b-2"
            >
              Analytics
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:border-b-primary h-12 rounded-none px-4 data-[state=active]:border-b-2"
            >
              Settings
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="questions" className="mt-6">
          <QuestionsTab />
        </TabsContent>

        <TabsContent value="responses" className="mt-6">
          <Card>
            <CardContent className="text-muted-foreground flex h-64 items-center justify-center p-6">
              Responses content will appear here
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <Card>
            <CardContent className="text-muted-foreground flex h-64 items-center justify-center p-6">
              Analytics content will appear here
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardContent className="text-muted-foreground flex h-64 items-center justify-center p-6">
              Settings content will appear here
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// TODO: use this for the candidates ranking interface: https://ui.bazza.dev/docs/data-table-filter
