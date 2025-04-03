'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { upsertProblem } from '@/actions/problems';
import { useChat } from '@/hooks/use-chat';

import AddQuestionTooltip from '@/components/challenges/create/add-question-tooltip';
import ChatInterface from '@/components/challenges/create/chat-interface';
import QuestionIndexButton from '@/components/challenges/create/question-index-button';
import QuestionPreview from '@/components/challenges/create/question-preview';
import RenameChallengeTitleDialog from '@/components/challenges/edit-title-dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { Problem, UpsertProblemResponse, upsertProblemRequestSchema } from '@/types/problems';
import { Question, defaultQuestion } from '@/types/questions';

import { MAX_NUM_QUESTIONS } from '@/lib/constants';
import { useDebouncedCallback } from '@/lib/utils';

export default function Home() {
  const previewContainerRef = useRef<HTMLDivElement>(null);
  // State for multiple questions
  const [questions, setQuestions] = useState<Question[]>([defaultQuestion]);
  // State for the currently selected question index
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number>(0);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [challengeTitle, setChallengeTitle] = useState('Test Challenge Title');

  const { question, messages, isLoading, updatedTabs, sendMessage, setQuestion, clearUpdatedTab } =
    useChat();

  // Keep the questions state in sync with the useChat question
  useEffect(() => {
    if (question && question.id) {
      setQuestions((prevQuestions) => {
        const updatedQuestions = [...prevQuestions];
        updatedQuestions[selectedQuestionIndex] = question;
        return updatedQuestions;
      });
    }
  }, [question, selectedQuestionIndex]);

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

  const onRenameDialogToggle = () => {
    setIsRenameDialogOpen((prevIsRenameDialogOpen) => !prevIsRenameDialogOpen);
  };

  const title = (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className="rounded-full p-1.5 hover:underline" onClick={onRenameDialogToggle}>
            <p className="text-md font-medium">{challengeTitle}</p>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">Rename</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <main className="flex h-screen">
      <div className="flex w-3/10 min-w-[300px] flex-col border-r">
        <div className="flex h-[60px] items-center justify-between border-b p-4">{title}</div>
        <ChatInterface
          messages={messages}
          isLoading={isLoading}
          updatedTabs={updatedTabs}
          onSendMessage={sendMessage}
        />
      </div>
      <div ref={previewContainerRef} className="w-7/10 overflow-auto">
        <div className="sticky top-0 z-10 flex h-[60px] items-center space-x-2 border-b p-3">
          {questions.map((_, index) => (
            <QuestionIndexButton
              key={index}
              isSelected={selectedQuestionIndex === index}
              index={index}
              onClick={() => {
                setSelectedQuestionIndex(index);
                setQuestion(questions[index]);
              }}
            />
          ))}
          {questions.length < MAX_NUM_QUESTIONS && (
            <AddQuestionTooltip
              onClick={() => {
                setQuestions((prev) => [...prev, defaultQuestion]);
                setSelectedQuestionIndex((prev) => prev + 1);
              }}
            />
          )}
        </div>
        <QuestionPreview
          isLoading={isLoading}
          question={questions[selectedQuestionIndex]}
          updatedTabs={updatedTabs}
          onTabChange={clearUpdatedTab}
          onProblemUpdate={onProblemUpdate}
        />
      </div>
      <RenameChallengeTitleDialog
        currentTitle={challengeTitle}
        isDialogOpen={isRenameDialogOpen}
        onToggle={onRenameDialogToggle}
        onSave={(newChallengeTitle: string) => {
          setChallengeTitle(newChallengeTitle);
        }}
      />
    </main>
  );
}
