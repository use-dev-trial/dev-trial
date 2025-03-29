import { UpdatedTab } from '@/hooks/use-chat';

import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Question } from '@/lib/question';

interface QuestionPreviewProps {
  question: Question;
  updatedTabs?: UpdatedTab[];
  onTabChange?: (tab: UpdatedTab) => void;
}

export default function QuestionPreview({
  question,
  updatedTabs = [],
  onTabChange,
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
      <p className="mb-3 text-lg font-semibold text-slate-800">{question.problem?.title}</p>
      <Tabs defaultValue="question" onValueChange={handleTabChange}>
        <div className="mb-6 flex items-center justify-between border-b">
          <TabsList className="flex h-10 justify-start bg-transparent p-0">
            <TabsTrigger
              value="question"
              className="rounded-none border-b-2 border-transparent px-4 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent"
            >
              Question
              {updatedTabs.includes('question') && (
                <span className="ml-2 inline-flex h-2 w-2 animate-pulse rounded-full bg-amber-500"></span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="files"
              className="rounded-none border-b-2 border-transparent px-4 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent"
            >
              Files
              {updatedTabs.includes('files') && (
                <span className="ml-2 inline-flex h-2 w-2 animate-pulse rounded-full bg-amber-500"></span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="test-cases"
              className="rounded-none border-b-2 border-transparent px-4 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent"
            >
              Test Cases
              {updatedTabs.includes('test-cases') && (
                <span className="ml-2 inline-flex h-2 w-2 animate-pulse rounded-full bg-amber-500"></span>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="overflow-auto">
          {/* Question Tab Content */}
          <TabsContent value="question" className="space-y-6">
            {/* Question Description */}
            <section>
              <div className="mb-4 flex items-center">
                <p className="text-md font-semibold text-slate-800">Question Description</p>
              </div>
              <div className="rounded-lg border border-slate-100 bg-white p-5 shadow-sm">
                <p className="leading-relaxed text-slate-700">{question?.problem?.description}</p>
              </div>
            </section>

            {/* Detailed Requirements */}
            <section>
              <div className="mb-4 flex items-center">
                <p className="text-md font-semibold text-slate-800">Detailed Requirements</p>
              </div>
              <div className="rounded-lg border border-slate-100 bg-white p-5 shadow-sm">
                <ol className="list-none space-y-3">
                  {question?.problem?.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start">
                      <Badge
                        variant="outline"
                        className="mt-0.5 mr-2 border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-50"
                      >
                        {index + 1}
                      </Badge>
                      <span className="text-slate-700">{requirement}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </section>
          </TabsContent>
          {/* Files Tab Content */}
          <TabsContent value="files">
            <section>
              <div className="mb-4 flex items-center">
                <p className="text-md font-semibold text-slate-800">Files</p>
              </div>
              <div className="divide-y divide-slate-100 rounded-lg border border-slate-100 bg-white shadow-sm">
                {question?.files?.files.map((file, index) => (
                  <div key={index} className="p-5">
                    <h3 className="mb-3 flex items-center font-medium text-slate-800">
                      <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-500"></span>
                      {file.name}
                    </h3>
                    <pre className="mt-2 overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                      {file.code}
                    </pre>
                  </div>
                ))}
              </div>
            </section>
          </TabsContent>

          {/* Test Cases Tab Content */}
          <TabsContent value="test-cases">
            <section>
              <div className="mb-4 flex items-center">
                <p className="text-md font-semibold text-slate-800">Test Cases</p>
              </div>
              <div className="divide-y divide-slate-100 rounded-lg border border-slate-100 bg-white shadow-sm">
                {question?.test_cases?.testCases.map((testCase, index) => (
                  <div key={index} className="p-5">
                    <h3 className="mb-3 flex items-center font-medium text-slate-800">
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
