'use client';

import { useState } from 'react';

import { MessageSquare } from 'lucide-react';

import QuestionTemplateCard from '@/components/challenges/home/question-template-card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface AddQuestionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddQuestion: (question: string) => void;
}

const defaultQuestions = [
  {
    id: 1,
    title: 'Multiple Choice',
    description: 'Ask a question with multiple predefined answers',
  },
  {
    id: 2,
    title: 'Open-ended',
    description: 'Ask a question that requires a written response',
  },
  {
    id: 3,
    title: 'Rating Scale',
    description: 'Ask for feedback on a numeric scale',
  },
  {
    id: 4,
    title: 'True/False',
    description: 'Ask a question with a binary answer',
  },
];

export default function AddQuestionDialog({
  isOpen,
  onClose,
  onAddQuestion,
}: AddQuestionDialogProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);

  const handleSelectTemplate = (id: number) => {
    setSelectedTemplate(id);
    const template = defaultQuestions.find((q) => q.id === id);
    if (template) {
      onAddQuestion(`${template.title}: New question`);
    }
  };

  const handleCreateWithAI = () => {
    onAddQuestion('AI Generated Question');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add a new question</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {defaultQuestions.map((question) => (
              <QuestionTemplateCard
                key={question.id}
                title={question.title}
                description={question.description}
                isSelected={selectedTemplate === question.id}
                onClick={() => handleSelectTemplate(question.id)}
              />
            ))}
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background text-muted-foreground px-2">OR</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="flex w-full items-center justify-center gap-2"
            onClick={handleCreateWithAI}
          >
            <MessageSquare className="h-4 w-4" />
            Create one by talking to our AI model
          </Button>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
