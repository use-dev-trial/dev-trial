'use client';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';

import type { Question } from '@/types/questions';

interface QuestionCardProps {
  question: Question;
  onClick: (question: Question) => void;
}

export function QuestionCard({ question, onClick }: QuestionCardProps) {
  return (
    <Card
      className="cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
      onClick={() => onClick(question)}
    >
      <CardHeader>
        <CardTitle className="text-sm">{question.problem.title}</CardTitle>
      </CardHeader>
    </Card>
  );
}
