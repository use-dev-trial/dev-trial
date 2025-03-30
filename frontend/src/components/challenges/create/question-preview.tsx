import { UpdatedTab } from '@/hooks/use-chat';

import FileContainer from '@/components/challenges/create/files-container';
import ProblemTab from '@/components/challenges/create/problem-tab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Problem } from '@/types/problems';
import { Question } from '@/types/question';

interface QuestionPreviewProps {
  isLoading: boolean;
  question: Question;
  updatedTabs?: UpdatedTab[];
  onTabChange?: (tab: UpdatedTab) => void;
  onProblemUpdate?: (input: Problem) => void;
}

export default function QuestionPreview({
  isLoading,
  question,
  updatedTabs = [],
  onTabChange,
  onProblemUpdate,
}: QuestionPreviewProps) {
  const handleTabChange = (value: string) => {
    if (
      onTabChange &&
      ['question', 'files', 'test-cases'].includes(value) &&
      updatedTabs.includes(value as UpdatedTab)
    ) {
      onTabChange(value as UpdatedTab);
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-5">
      <p className="text-md mb-4 font-semibold">{question.problem?.title}</p>
      <Tabs defaultValue="question" onValueChange={handleTabChange}>
        <div className="mb-6 flex items-center justify-between border-b">
          <TabsList className="flex h-10 justify-start bg-transparent p-0">
            <TabsTrigger
              value="question"
              className="rounded-md border-b-2 border-transparent px-4 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent"
            >
              Question
              {updatedTabs.includes('question') && (
                <span className="ml-2 inline-flex h-2 w-2 animate-pulse rounded-full bg-amber-500"></span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="files"
              className="rounded-md border-b-2 border-transparent px-4 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent"
            >
              Files
              {updatedTabs.includes('files') && (
                <span className="ml-2 inline-flex h-2 w-2 animate-pulse rounded-full bg-amber-500"></span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="test-cases"
              className="rounded-md border-b-2 border-transparent px-4 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent"
            >
              Test Cases
              {updatedTabs.includes('test-cases') && (
                <span className="ml-2 inline-flex h-2 w-2 animate-pulse rounded-full bg-amber-500"></span>
              )}
            </TabsTrigger>
          </TabsList>
          {isLoading && (
            <div className="sticky top-0 z-10 flex items-center justify-between border-b p-4">
              <div className="flex animate-pulse items-center space-x-2 text-sm">
                <span className="inline-block h-2 w-2 rounded-full bg-blue-500 dark:bg-blue-600"></span>
                <span>Generating</span>
              </div>
            </div>
          )}
        </div>

        <div className="overflow-auto">
          <TabsContent value="question" className="space-y-6">
            <ProblemTab problem={question.problem} onProblemUpdate={onProblemUpdate} />
          </TabsContent>
          {/* Files Tab Content */}
          <TabsContent value="files">
            <section>
              <FileContainer files={question?.files || []} />
            </section>
          </TabsContent>

          {/* Test Cases Tab Content */}
          <TabsContent value="test-cases">
            <section>
              <div className="mb-4 flex items-center">
                <p className="text-md font-semibold">Test Cases</p>
              </div>
              <div className="divide-y divide-slate-100 rounded-lg border shadow-sm">
                {question?.test_cases?.map((testCase, index) => (
                  <div key={index} className="p-5">
                    <h3 className="mb-3 flex items-center font-medium">
                      <span className="mr-2 inline-block h-2 w-2 rounded-full bg-blue-500"></span>
                      {testCase.description}
                    </h3>
                    {/* {testCase.input && (
                      <div className="mb-3">
                        <h4 className="mb-1 text-sm font-medium text-slate-700">Input:</h4>
                        <pre className="overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                          {testCase.input}
                        </pre>
                      </div>
                    )}
                    {testCase.expected_output && (
                      <div>
                        <h4 className="mb-1 text-sm font-medium text-slate-700">
                          Expected Output:
                        </h4>
                        <pre className="overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                          {testCase.expected_output}
                        </pre>
                      </div>
                    )} */}
                  </div>
                ))}
              </div>
            </section>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
