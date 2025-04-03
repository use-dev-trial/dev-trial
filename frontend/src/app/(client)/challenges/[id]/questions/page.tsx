'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { upsertProblem } from '@/actions/problems';
import { useChat } from '@/hooks/use-chat';
import { Settings } from 'lucide-react';
import { Plus } from 'lucide-react';

import ChatInterface from '@/components/challenges/create/chat-interface';
import QuestionPreview from '@/components/challenges/create/question-preview';
import RenameChallengeTitleDialog from '@/components/challenges/edit-title-dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { Problem, UpsertProblemResponse, upsertProblemRequestSchema } from '@/types/problems';
import { Question, defaultQuestion } from '@/types/questions';

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

  // Add a new question
  const addNewQuestion = () => {
    setQuestions((prev) => [...prev, defaultQuestion]);
    setSelectedQuestionIndex((prev) => prev + 1);
  };

  // Handle selecting a question
  const handleQuestionSelect = (index: number) => {
    setSelectedQuestionIndex(index);
    // Update the current question in useChat
    setQuestion(questions[index]);
  };

  const onRenameDialogToggle = () => {
    setIsRenameDialogOpen((prevIsRenameDialogOpen) => !prevIsRenameDialogOpen);
  };

  return (
    <main className="flex h-screen">
      <div className="flex w-3/10 min-w-[300px] flex-col border-r">
        <div className="flex h-[60px] items-center justify-between border-b p-4">
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

          {/* <button onClick={handleCreateChallenge}>Create Challenge</button> */}
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="rounded-full p-1.5 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-gray-700 dark:hover:text-gray-300">
                    <Settings size={16} />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">Settings</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <ChatInterface
          messages={messages}
          isLoading={isLoading}
          updatedTabs={updatedTabs}
          onSendMessage={sendMessage}
        />
      </div>
      <div ref={previewContainerRef} className="w-7/10 overflow-auto">
        {/* Question selector row */}
        <div className="sticky top-0 z-10 flex h-[60px] items-center space-x-2 border-b p-3">
          {questions.map((q, index) => (
            <button
              key={index}
              onClick={() => handleQuestionSelect(index)}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                selectedQuestionIndex === index
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
              }`}
              aria-label={`Question ${index + 1}`}
            >
              {index + 1}
            </button>
          ))}
          {questions.length < 3 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div
                    onClick={addNewQuestion}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                    aria-label="Add new question"
                  >
                    <Plus size={16} />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p className="text-sm">Add new question</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
