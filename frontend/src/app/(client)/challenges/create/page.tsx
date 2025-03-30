'use client';

import { useCallback, useRef } from 'react';

// import { createChallenge } from '@/actions/challenges';
import { upsertProblem } from '@/actions/problems';
import { useChat } from '@/hooks/use-chat';
import { Settings } from 'lucide-react';
import { Pencil } from 'lucide-react';

import ChatInterface from '@/components/challenges/create/chat-interface';
import QuestionPreview from '@/components/challenges/create/question-preview';

import { Problem, UpsertProblemResponse, upsertProblemRequestSchema } from '@/types/problems';

import { useDebouncedCallback } from '@/lib/utils';

export default function Home() {
  const previewContainerRef = useRef<HTMLDivElement>(null);

  const { question, messages, isLoading, updatedTabs, sendMessage, setQuestion, clearUpdatedTab } =
    useChat();

  const handleUpsertProblem = useCallback(
    async (problemInput: Problem, currentQuestionId: string | undefined) => {
      console.log('Debounced API call executing...');
      try {
        const upsertProblemRequest = upsertProblemRequestSchema.parse({
          ...problemInput,
          question_id: currentQuestionId,
        });
        const upsertProblemResponse: UpsertProblemResponse =
          await upsertProblem(upsertProblemRequest);

        setQuestion((prev) => ({
          ...prev,
          id: upsertProblemResponse.question_id,
          problem: upsertProblemResponse,
        })); // Register ID changes for both the question and/or problem (if they are not created before this invocation)
        console.log('Problem saved successfully:', upsertProblemResponse.question_id);
      } catch (error) {
        console.error('Error updating problem via debounced call:', error);
        // Can consider reversing the optimistic UI update
      }
    },
    [],
  );

  const debouncedSaveProblem = useDebouncedCallback(handleUpsertProblem, 1000);

  const onProblemUpdate = async (input: Problem) => {
    // Update the question content on the UI regardless of whether API call succeeds
    setQuestion((prev) => ({ ...prev, problem: input }));

    debouncedSaveProblem(input, question.id);
  };

  // const handleCreateChallenge = async () => {
  //   const challenge = await createChallenge({
  //     name: 'Test Challenge',
  //     description: 'Test Description',
  //     question_id: '',
  //   });
  //   console.log(challenge);
  // };

  return (
    <main className="flex h-screen">
      <div className="flex w-3/10 flex-col border-r">
        <div className="flex items-center justify-between border-b p-4">
          <p className="text-md font-medium">Test Challenge Title</p>
          {/* <button onClick={handleCreateChallenge}>Create Challenge</button> */}
          <div className="flex items-center space-x-2">
            <button className="rounded-full p-1.5 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-gray-700 dark:hover:text-gray-300">
              <Pencil size={16} />
            </button>
            <button className="rounded-full p-1.5 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-gray-700 dark:hover:text-gray-300">
              <Settings size={16} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <ChatInterface
            messages={messages}
            onSendMessage={sendMessage}
            isLoading={isLoading}
            updatedTabs={updatedTabs}
          />
        </div>
      </div>
      <div ref={previewContainerRef} className="w-7/10 overflow-auto">
        <QuestionPreview
          isLoading={isLoading}
          question={question}
          updatedTabs={updatedTabs}
          onTabChange={clearUpdatedTab}
          onProblemUpdate={onProblemUpdate}
        />
      </div>
    </main>
  );
}
