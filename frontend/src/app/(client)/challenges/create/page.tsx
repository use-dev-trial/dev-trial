'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

// import { createChallenge } from '@/actions/challenges';
import { upsertProblem } from '@/actions/problems';
import { UpdatedTab, useChat } from '@/hooks/use-chat';
import { Settings } from 'lucide-react';
import { Pencil } from 'lucide-react';

import ChatInterface from '@/components/challenges/create/chat-interface';
import QuestionPreview from '@/components/challenges/create/question-preview';

import { Message } from '@/types/messages';
import {
  Problem,
  UpsertProblemResponse,
  defaultProblem,
  upsertProblemRequestSchema,
} from '@/types/problems';
import { Question, defaultQuestion } from '@/types/question';

import { useDebouncedCallback } from '@/lib/utils';

export default function Home() {
  const [question, setQuestion] = useState<Question>(defaultQuestion);

  const [updatedQuestion, setUpdatedQuestion] = useState<Question>(question);
  const [updatedTabs, setUpdatedTabs] = useState<UpdatedTab[]>([]);

  const previewContainerRef = useRef<HTMLDivElement>(null);

  const handleResponse = useCallback((message: Message, messageId?: string) => {
    console.log(message);
    if (messageId) {
      console.log('Response message ID:', messageId);
    }
  }, []);

  const handleQuestionUpdate = useCallback((update: Question, changedTabs: UpdatedTab[]) => {
    const scrollPosition = previewContainerRef.current?.scrollTop || 0;

    // Only update if there are actual changes
    if (update) {
      setUpdatedQuestion((prevQuestion) => {
        const updated: Question = {
          id: prevQuestion.id,
          problem: prevQuestion.problem
            ? {
                id: prevQuestion.problem.id,
                title: prevQuestion.problem.title,
                description: prevQuestion.problem.description,
                requirements: prevQuestion.problem.requirements,
              }
            : defaultProblem,
          files: prevQuestion.files,
          test_cases: prevQuestion.test_cases,
        };

        let hasChanges = false;

        if (update.problem && prevQuestion.problem) {
          const newProblem = {
            id: prevQuestion.problem.id,
            title: update.problem.title ?? prevQuestion.problem.title,
            description: update.problem.description ?? prevQuestion.problem.description,
            requirements: update.problem.requirements ?? prevQuestion.problem.requirements,
          };

          // Only update if something actually changed
          if (
            newProblem.title !== prevQuestion.problem.title ||
            newProblem.description !== prevQuestion.problem.description ||
            JSON.stringify(newProblem.requirements) !==
              JSON.stringify(prevQuestion.problem.requirements)
          ) {
            updated.problem = newProblem;
            hasChanges = true;
          }
        }

        if (update.test_cases) {
          updated.test_cases = update.test_cases;
          hasChanges = true;
        }

        if (update.files) {
          updated.files = update.files;
          hasChanges = true;
        }

        // Only return a new object if there were actually changes
        return hasChanges ? updated : prevQuestion;
      });
    }

    // Only update updatedTabs if there are new tabs to add
    if (changedTabs.length > 0) {
      setUpdatedTabs((prev) => {
        const newTabs = [...new Set([...prev, ...changedTabs])];
        // Only update if there are actually new tabs
        return newTabs.length !== prev.length ? newTabs : prev;
      });
    }

    // Restore scroll position after update
    setTimeout(() => {
      if (previewContainerRef.current) {
        previewContainerRef.current.scrollTop = scrollPosition;
      }
    }, 0);
  }, []);

  const { messages, sendMessage, isLoading, clearUpdatedTab } = useChat({
    onResponse: handleResponse,
    onQuestionUpdate: handleQuestionUpdate,
  });

  useEffect(() => {
    // Only update the question state when updatedQuestion actually changes
    setQuestion(updatedQuestion);
  }, [updatedQuestion]);

  // Handle clearing a tab's updated status when it's viewed
  const onTabChange = (tab: UpdatedTab) => {
    clearUpdatedTab(tab);

    // Also update our local state
    setUpdatedTabs((prev) => prev.filter((t) => t !== tab));
  };

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
  //     question_id: 'temp-id',
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
          onTabChange={onTabChange}
          onProblemUpdate={onProblemUpdate}
        />
      </div>
    </main>
  );
}
