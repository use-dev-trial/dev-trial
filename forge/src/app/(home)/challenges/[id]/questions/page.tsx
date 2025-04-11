'use client';

import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

import { useCallback, useEffect, useRef, useState } from 'react';

import { upsertProblem } from '@/actions/problems';
import { useSingleChallenge } from '@/hooks/challenges/use-single-challenge';
import { useChat } from '@/hooks/use-chat';
import { toast } from 'sonner';

import ChatInterface from '@/components/challenges/questions/chat-interface';
import DeleteQuestionDialog from '@/components/challenges/questions/delete-question-dialog';
import QuestionIndexButton from '@/components/challenges/questions/question-index-button';
import QuestionPreview from '@/components/challenges/questions/question-preview';
import QuestionTemplatesDialog from '@/components/challenges/questions/question-templates-dialog';
import RenameChallengeTitleDialog from '@/components/challenges/questions/rename-challenge-title-dialog';
import Loader from '@/components/shared/loader';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { Problem, UpsertProblemResponse, upsertProblemRequestSchema } from '@/types/problems';
import { Question, defaultQuestion } from '@/types/questions';

import { MAX_NUM_QUESTIONS, ROUTES } from '@/lib/constants';
import { useDebouncedCallback } from '@/lib/utils';

export default function Home() {
  const router = useRouter();
  const params = useParams();
  const challenge_id = params.id as string;

  const {
    challenge,
    isLoading: isLoadingChallenge,
    error: challengeError,
    error: errorChallenge,
  } = useSingleChallenge(challenge_id);

  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [questions, setQuestions] = useState<Question[]>([defaultQuestion]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number>(0);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [challengeName, setChallengeName] = useState('');

  const {
    question,
    messages,
    isLoading: isLoadingChat,
    updatedTabs,
    sendMessage,
    setQuestion,
    clearUpdatedTab,
  } = useChat({ challenge_id: challenge_id });

  useEffect(() => {
    if (isLoadingChallenge) {
      return;
    }

    if (challengeError) {
      console.error('Error fetching challenge:', challenge_id, errorChallenge);
      toast('Failed to load challenge');
      router.replace(ROUTES.CHALLENGES);
      return;
    }

    if (!isLoadingChallenge && !challengeError && !challenge) {
      console.warn('Challenge fetch succeeded but returned no data for ID:', challenge_id);
      toast('The requested challenge could not be found.');
      router.replace(ROUTES.CHALLENGES);
      return;
    }

    if (challenge) {
      setChallengeName(challenge.name);
    }
  }, [isLoadingChallenge, challengeError, errorChallenge, challenge, challenge_id, router, toast]);

  const handleUpsertProblem = useCallback(
    async (problemInput: Problem, currentQuestionId: string | undefined) => {
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
      } catch (error) {
        console.error('Error updating problem via debounced call:', error);
      }
    },
    [],
  );

  const debouncedSaveProblem = useDebouncedCallback(handleUpsertProblem, 1000);

  const onProblemUpdate = async (input: Problem) => {
    setQuestion((prev) => ({ ...prev, problem: input }));
    debouncedSaveProblem(input, question.id);
  };

  const onRenameDialogToggle = () => {
    setIsRenameDialogOpen((prevIsRenameDialogOpen) => !prevIsRenameDialogOpen);
  };

  if (isLoadingChallenge || challengeError) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader text="questions" />
      </div>
    );
  }

  const title = (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className="rounded-full p-1.5 hover:underline" onClick={onRenameDialogToggle}>
            <p className="text-md font-medium">{challengeName}</p>
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
          isLoading={isLoadingChat}
          updatedTabs={updatedTabs}
          onSendMessage={sendMessage}
        />
      </div>
      <div ref={previewContainerRef} className="w-7/10 overflow-auto">
        <div className="sticky top-0 z-10 flex h-[60px] items-center justify-between border-b p-3">
          <div className="flex items-center space-x-2">
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
              <QuestionTemplatesDialog
                onSelectQuestion={(question: Question) => {
                  setQuestions((prev) => [...prev, question]);
                  setSelectedQuestionIndex((prev) => prev + 1);
                }}
              />
            )}
          </div>
          <DeleteQuestionDialog
            onConfirmBtnClick={() => {
              setQuestions((prev) => {
                const filtered = prev.filter((q) => q.id !== questions[selectedQuestionIndex].id);
                return filtered.length === 0 ? [defaultQuestion] : filtered;
              });
              setSelectedQuestionIndex((prev) => Math.max(prev - 1, 0));
            }}
          />
        </div>
        <QuestionPreview
          isLoading={isLoadingChat}
          question={questions[selectedQuestionIndex]}
          updatedTabs={updatedTabs}
          onTabChange={clearUpdatedTab}
          onProblemUpdate={onProblemUpdate}
        />
      </div>
      <RenameChallengeTitleDialog
        currentTitle={challengeName}
        isDialogOpen={isRenameDialogOpen}
        onToggle={onRenameDialogToggle}
        onSave={(newChallengeTitle: string) => {
          setChallengeName(newChallengeTitle);
        }}
      />
    </main>
  );
}
