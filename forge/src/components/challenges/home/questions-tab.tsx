'use client';

import { useRouter } from 'next/navigation';

import { useState } from 'react';

import { createTemplateQuestion } from '@/actions/questions';
import { useAllQuestions } from '@/hooks/questions/use-all-question';
import {
  CheckSquare,
  ChevronDown,
  ChevronRight,
  FileCode,
  MessageSquare,
  PlusCircle,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { createTemplateQuestionRequestSchema } from '@/types/questions';

import { ROUTES } from '@/lib/constants';

type QuestionsTabProps = {
  challenge_id: string;
};
export default function QuestionsTab({ challenge_id }: QuestionsTabProps) {
  const router = useRouter();
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);
  const { questions } = useAllQuestions(challenge_id);

  const toggleExpand = (questionId: string) => {
    if (expandedQuestionId === questionId) {
      setExpandedQuestionId(null);
    } else {
      setExpandedQuestionId(questionId);
    }
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop() || '';
    switch (ext) {
      case 'py':
        return <FileCode className="h-4 w-4 text-blue-600" />;
      case 'js':
      case 'jsx':
      case 'ts':
      case 'tsx':
        return <FileCode className="h-4 w-4 text-yellow-600" />;
      default:
        return <FileCode className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {questions.length === 0 ? (
        <div className="bg-muted/30 flex flex-col items-center justify-center rounded-lg border border-dashed p-12">
          <MessageSquare className="text-muted-foreground mb-4 h-12 w-12" />
          <p className="text-muted-foreground mb-4 text-lg">No questions yet</p>
          <p className="text-muted-foreground mb-6 max-w-sm text-center text-sm">
            Create questions for your challenge to get started
          </p>
          <Button
            className="bg-blue-500 hover:bg-blue-600"
            onClick={async () => {
              const createTemplateQuestionRequest = createTemplateQuestionRequestSchema.parse({
                challenge_id: challengeId,
              });
              await createTemplateQuestion(createTemplateQuestionRequest);
              router.push(ROUTES.QUESTIONS(challengeId));
            }}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Question
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {questions.map((question) => (
            <Card key={question.id} className="overflow-hidden transition-shadow hover:shadow-md">
              <CardHeader className="cursor-pointer pb-3" onClick={() => toggleExpand(question.id)}>
                <div className="flex items-center">
                  {expandedQuestionId === question.id ? (
                    <ChevronDown className="text-muted-foreground mr-2 h-5 w-5" />
                  ) : (
                    <ChevronRight className="text-muted-foreground mr-2 h-5 w-5" />
                  )}
                  <CardTitle>{question.problem.title}</CardTitle>
                </div>
                <CardDescription className="ml-7 line-clamp-2">
                  {question.problem.description || 'No description provided'}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="mb-3 flex flex-wrap gap-3">
                  <div className="flex items-center">
                    <CheckSquare className="mr-1 h-4 w-4 text-blue-500" />
                    <Badge variant="secondary" className="font-normal">
                      {question.test_cases.length} Test{' '}
                      {question.test_cases.length === 1 ? 'Case' : 'Cases'}
                    </Badge>
                  </div>
                  <div className="flex items-center">
                    <FileCode className="mr-1 h-4 w-4 text-green-500" />
                    <Badge variant="secondary" className="font-normal">
                      {question.files.length} {question.files.length === 1 ? 'File' : 'Files'}
                    </Badge>
                  </div>
                </div>

                {expandedQuestionId === question.id && (
                  <div className="mt-4 space-y-6 border-t pt-4">
                    {/* Test Cases Section */}
                    <div>
                      <h3 className="mb-2 text-sm font-medium">Test Cases</h3>
                      <div className="space-y-3">
                        {question.test_cases.map((testCase) => (
                          <div key={testCase.id} className="bg-muted/30 rounded-md border p-3">
                            <p className="text-sm font-medium">{testCase.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Files Section */}
                    <div>
                      <h3 className="mb-2 text-sm font-medium">Files</h3>
                      <div className="space-y-3">
                        {question.files.map((file) => (
                          <div key={file.id} className="overflow-hidden rounded-md border">
                            <div className="bg-muted/30 flex items-center justify-between p-2">
                              <div className="flex items-center">
                                {getFileIcon(file.name)}
                                <span className="ml-2 text-sm font-medium">{file.name}</span>
                              </div>
                            </div>
                            <div className="bg-muted/10 p-3">
                              <pre className="text-muted-foreground max-h-[240px] overflow-y-auto text-xs">
                                <code>{file.code}</code>
                              </pre>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
