import { Badge } from '@/components/ui/badge';

import { Question } from '@/lib/question';

interface QuestionPreviewProps {
  question: Question;
}

export default function QuestionPreview({ question }: QuestionPreviewProps) {
  return (
    <div className="mx-auto max-w-4xl space-y-10 p-10">
      {/* Question Title */}
      <div className="mb-2 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-center text-2xl font-semibold text-slate-800">
          {question?.problem?.title}
        </h1>
        <div className="mt-2 flex justify-center">
          <div className="h-1 w-20 rounded-full bg-blue-500"></div>
        </div>
      </div>

      {/* Question Description */}
      <section>
        <div className="mb-4 flex items-center">
          <div className="mr-2 h-6 w-1 rounded-full bg-blue-500"></div>
          <h2 className="text-lg font-semibold text-slate-800">QUESTION DESCRIPTION</h2>
        </div>
        <div className="rounded-lg border border-slate-100 bg-white p-5 shadow-sm">
          <p className="leading-relaxed text-slate-700">{question?.problem?.description}</p>
        </div>
      </section>

      {/* Detailed Requirements */}
      <section>
        <div className="mb-4 flex items-center">
          <div className="mr-2 h-6 w-1 rounded-full bg-amber-500"></div>
          <h2 className="text-lg font-semibold text-slate-800">DETAILED REQUIREMENTS</h2>
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

      {/* Files */}
      <section>
        <div className="mb-4 flex items-center">
          <div className="mr-2 h-6 w-1 rounded-full bg-emerald-500"></div>
          <h2 className="text-lg font-semibold text-slate-800">FILES</h2>
        </div>
        <div className="divide-y divide-slate-100 rounded-lg border border-slate-100 bg-white shadow-sm">
          {question?.files?.files.map((file, index) => (
            <div key={index} className="p-5">
              <h3 className="mb-3 flex items-center font-medium text-slate-800">
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-500"></span>
                {file.name}
              </h3>
              <pre className="mt-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                {file.code}
              </pre>
            </div>
          ))}
        </div>
      </section>

      {/* Test Cases */}
      <section>
        <div className="mb-4 flex items-center">
          <div className="mr-2 h-6 w-1 rounded-full bg-emerald-500"></div>
          <h2 className="text-lg font-semibold text-slate-800">TEST CASES</h2>
        </div>
        <div className="divide-y divide-slate-100 rounded-lg border border-slate-100 bg-white shadow-sm">
          {question?.test_cases?.testCases.map((interaction, index) => (
            <div key={index} className="p-5">
              <h3 className="mb-3 flex items-center font-medium text-slate-800">
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-500"></span>
                {interaction.description}
              </h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
