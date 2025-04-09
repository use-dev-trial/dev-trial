'use client';

import type React from 'react';
import { useEffect, useState } from 'react';

import { getAllQuestions } from '@/actions/questions';

import { QuestionCard } from '@/components/challenges/questions/question-card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import type { Question } from '@/types/questions';

interface QuestionTemplatesDialogProps {
  triggerButton: React.ReactNode;
  onSelectQuestion: (question: Question) => void;
}

export default function QuestionTemplatesDialog({
  triggerButton,
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

  const handleQuestionClick = (question: Question) => {
    onSelectQuestion(question);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="flex max-h-[80vh] flex-col sm:max-w-[80vw]">
        <DialogHeader>
          <DialogTitle>Select a Question Template</DialogTitle>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto pr-4">
          <div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2 md:grid-cols-3">
            {questions.map((question) => (
              <QuestionCard key={question.id} question={question} onClick={handleQuestionClick} />
            ))}
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={() => setOpen(false)}>Cancel</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
