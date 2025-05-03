import { QuestionPreviewTabName, questionPreviewTabName } from '@/hooks/use-chat';

import FilesTab from '@/components/challenges/questions/tabs/files';
import MetricsTab from '@/components/challenges/questions/tabs/metrics';
import ProblemTab from '@/components/challenges/questions/tabs/problem';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Question } from '@/types/questions';

interface QuestionPreviewProps {
  isLoading: boolean;
  question: Question;
  updatedTabs: QuestionPreviewTabName[];
  onTabChange: (tab: QuestionPreviewTabName) => void;
}

export default function QuestionPreview({
  isLoading,
  question,
  updatedTabs,
  onTabChange,
}: QuestionPreviewProps) {
  const tabList = (
    <div className="mb-6 flex items-center justify-between border-b">
      <TabsList className="flex h-10 justify-start bg-transparent p-0">
        <TabsTrigger
          value={questionPreviewTabName.Values.problem}
          className="rounded-md border-b-2 border-transparent px-4 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent"
        >
          Problem
          {updatedTabs.includes(questionPreviewTabName.Values.problem) && (
            <span className="ml-2 inline-flex h-2 w-2 animate-pulse rounded-full bg-amber-500"></span>
          )}
        </TabsTrigger>
        <TabsTrigger
          value={questionPreviewTabName.Values.files}
          className="rounded-md border-b-2 border-transparent px-4 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent"
        >
          Files
          {updatedTabs.includes(questionPreviewTabName.Values.files) && (
            <span className="ml-2 inline-flex h-2 w-2 animate-pulse rounded-full bg-amber-500"></span>
          )}
        </TabsTrigger>
        <TabsTrigger
          value={questionPreviewTabName.Values['test-cases']}
          className="rounded-md border-b-2 border-transparent px-4 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent"
        >
          Test Cases
          {updatedTabs.includes(questionPreviewTabName.Values['test-cases']) && (
            <span className="ml-2 inline-flex h-2 w-2 animate-pulse rounded-full bg-amber-500"></span>
          )}
        </TabsTrigger>
        <TabsTrigger
          value={questionPreviewTabName.Values.metrics}
          className="rounded-md border-b-2 border-transparent px-4 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent"
        >
          Metrics
          {updatedTabs.includes(questionPreviewTabName.Values.metrics) && (
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
  );

  const tabContent = (
    <div className="overflow-auto">
      <TabsContent value="problem" className="space-y-6">
        <ProblemTab problem={question.problem} />
      </TabsContent>
      <TabsContent value="files">
        <FilesTab files={question.files || []} />
      </TabsContent>
      <TabsContent value="metrics">
        <MetricsTab question_id={question.id} />
      </TabsContent>
      <TabsContent value="test-cases">
        <section>
          <div className="mb-4 flex items-center">
            <p className="text-md font-semibold">Test Cases</p>
          </div>
          <div className="h-[60px] divide-y divide-slate-100 rounded-lg border shadow-sm">
            {question.test_cases.map((testCase, index) => (
              <div key={index} className="p-5">
                <h3 className="mb-3 flex items-center font-medium">
                  <span className="mr-2 inline-block h-2 w-2 rounded-full bg-blue-500"></span>
                  {testCase.description}
                </h3>
              </div>
            ))}
          </div>
        </section>
      </TabsContent>
    </div>
  );

  return (
    <div className="mx-auto max-w-4xl p-5">
      <p className="text-md mb-4 font-semibold">{question.problem.title || 'Untitled Question'}</p>
      <Tabs
        defaultValue={questionPreviewTabName.Values.problem}
        onValueChange={(value: string) => onTabChange(value as QuestionPreviewTabName)}
      >
        {tabList}
        {tabContent}
      </Tabs>
    </div>
  );
}
