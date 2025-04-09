'use client';

import { useEffect, useState } from 'react';

import { getAllQuestions } from '@/actions/questions';
import { Plus } from 'lucide-react';

import { QuestionCard } from '@/components/challenges/questions/question-card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import type { Question } from '@/types/questions';

interface QuestionTemplatesDialogProps {
  onSelectQuestion: (question: Question) => void;
}
export default function QuestionTemplatesDialog({
  onSelectQuestion,
}: QuestionTemplatesDialogProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      const fetchedQuestions: Question[] = await getAllQuestions();
      setQuestions(fetchedQuestions);
    };
    fetchQuestions();
  }, []);

  const handleSelectQuestion = (question: Question) => {
    onSelectQuestion(question);
    setOpen(false);
  };

  return (
    <TooltipProvider>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                aria-label="Add new question"
                onClick={() => setOpen(true)}
              >
                <Plus size={16} />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p className="text-sm">Add new question</p>
            </TooltipContent>
          </Tooltip>
        </DialogTrigger>

        <DialogContent className="flex max-h-[80vh] flex-col sm:max-w-[80vw]">
          <DialogHeader>
            <DialogTitle>Select a Question Template</DialogTitle>
          </DialogHeader>
          <div className="flex-grow overflow-y-auto pr-4">
            <div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2 md:grid-cols-3">
              {questions.map((question) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  onClick={() => handleSelectQuestion(question)}
                />
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
