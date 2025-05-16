'use client';

import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

import { useEffect, useRef, useState } from 'react';

import { createTemplateQuestion } from '@/actions/questions';
import { useGetSingleChallenge } from '@/hooks/challenges/read/single';
import { useAllQuestions } from '@/hooks/questions/use-all-question';
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

import { Question, createTemplateQuestionRequestSchema, defaultQuestion } from '@/types/questions';

import { MAX_NUM_QUESTIONS, ROUTES } from '@/lib/constants';

export default function Home() {
  const router = useRouter();
  const params = useParams();
  const challenge_id = params.id as string;

  const {
    challenge,
    isLoading: isLoadingChallenge,
    error: challengeError,
    error: errorChallenge,
  } = useGetSingleChallenge(challenge_id);
  const { questions, isLoading: isLoadingQuestions, refetch } = useAllQuestions(challenge_id);
  const [isCreatingNewQuestion, setIsCreatingNewQuestion] = useState(false);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number>(0);

  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [challengeName, setChallengeName] = useState('');

  const {
    updatedQuestion, // do not refer to this directly. Use questions[selectedQuestionIndex] instead
    messages,
    isLoading: isLoadingChat,
    updatedTabs,
    sendMessage,
    clearUpdatedTab,
  } = useChat({ challenge_id, question: questions[selectedQuestionIndex] });

  useEffect(() => {
    if (isLoadingChallenge || isLoadingQuestions) {
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
  }, [isLoadingChallenge, challengeError, errorChallenge, challenge, challenge_id, router]);

  const onRenameDialogToggle = () => {
    setIsRenameDialogOpen((prevIsRenameDialogOpen) => !prevIsRenameDialogOpen);
  };

  if (isLoadingChallenge || isLoadingQuestions || isCreatingNewQuestion) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader text="Loading question" />
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
                }}
              />
            ))}
            {questions.length < MAX_NUM_QUESTIONS && (
              <QuestionTemplatesDialog
                onCreateNewQuestion={async () => {
                  try {
                    setIsCreatingNewQuestion(true);
                    await createTemplateQuestion({
                      challenge_id: challenge_id,
                    });
                    await refetch();
                    setSelectedQuestionIndex((prev) => prev + 1);
                  } finally {
                    setIsCreatingNewQuestion(false);
                  }
                }}
                onSelectQuestion={async (question: Question) => {
                  const createTemplateQuestionRequest = createTemplateQuestionRequestSchema.parse({
                    challenge_id: challenge_id,
                  });
                  const newQuestion = await createTemplateQuestion(createTemplateQuestionRequest);
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
