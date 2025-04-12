'use client';

import { useParams } from 'next/navigation';

import { useState } from 'react';

import { useSingleChallenge } from '@/hooks/challenges/use-single-challenge';
import { Send } from 'lucide-react';

import QuestionsTab from '@/components/challenges/home/questions-tab';
import InviteCandidateDialog from '@/components/challenges/invite-candidate-dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ChallengeInterface() {
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('questions');
  const params = useParams();
  const { challenge, isLoading, error } = useSingleChallenge(params.id as string);

  const onInviteDialogToggle = () => {
    setIsInviteDialogOpen((prevIsInviteDialogOpen) => !prevIsInviteDialogOpen);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {isLoading ? (
        <div className="flex items-center justify-center p-8">Loading challenge data...</div>
      ) : error ? (
        <div className="p-4 text-center text-red-500">Failed to load challenge data</div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-start space-x-3">
            <h1 className="text-lg font-bold">{challenge?.name}</h1>
            <Send
              className="h-7 w-7 text-blue-600 hover:cursor-pointer"
              onClick={onInviteDialogToggle}
            />
          </div>
          <p className="text-muted-foreground mb-4">{challenge?.description}</p>

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
              <QuestionsTab challengeId={params.id as string} />
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
      )}
      <InviteCandidateDialog
        isOpen={isInviteDialogOpen}
        onOpenChange={onInviteDialogToggle}
        challengeId={params.id as string}
        challengeTitle={challenge?.name || ''}
      />
    </div>
  );
}

// TODO: use this for the candidates ranking interface: https://ui.bazza.dev/docs/data-table-filter
