'use client';

import { useState } from 'react';

import { PlusCircle } from 'lucide-react';

import AddQuestionDialog from '@/components/challenges/home/add-question-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function QuestionsTab() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);

  const handleAddQuestion = (question: string) => {
    setQuestions([...questions, question]);
    setIsDialogOpen(false);
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-muted-foreground mb-6">Create questions for your challenge</p>
        <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => setIsDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Question
        </Button>
      </div>

      {questions.length > 0 && (
        <div className="mt-6 grid gap-4">
          {questions.map((question, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <p>{question}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AddQuestionDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onAddQuestion={handleAddQuestion}
      />
    </div>
  );
}
