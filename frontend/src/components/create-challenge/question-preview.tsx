import { Badge } from '@/components/ui/badge';

interface SampleInteraction {
  title: string;
  steps: string[];
}

interface QuestionData {
  title: string;
  description: string;
  requirements: string[];
  sampleInteractions: SampleInteraction[];
}

interface QuestionPreviewProps {
  question: QuestionData;
}

export default function QuestionPreview({ question }: QuestionPreviewProps) {
  return (
    <div className="mx-auto max-w-4xl space-y-10 p-10">
      {/* Question Title */}
      <div className="mb-2 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-center text-2xl font-semibold text-slate-800">{question.title}</h1>
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
          <p className="leading-relaxed text-slate-700">{question.description}</p>
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
            {question.requirements.map((requirement, index) => (
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

      {/* Sample Interactions */}
      <section>
        <div className="mb-4 flex items-center">
          <div className="mr-2 h-6 w-1 rounded-full bg-emerald-500"></div>
          <h2 className="text-lg font-semibold text-slate-800">SAMPLE INTERACTION</h2>
        </div>
        <div className="divide-y divide-slate-100 rounded-lg border border-slate-100 bg-white shadow-sm">
          {question.sampleInteractions.map((interaction, index) => (
            <div key={index} className="p-5">
              <h3 className="mb-3 flex items-center font-medium text-slate-800">
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-500"></span>
                {interaction.title}
              </h3>
              <ol className="list-none space-y-2 pl-4">
                {interaction.steps.map((step, stepIndex) => (
                  <li key={stepIndex} className="flex items-start">
                    <Badge
                      variant="outline"
                      className="mt-0.5 mr-2 border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50"
                    >
                      {stepIndex + 1}
                    </Badge>
                    <span className="text-slate-700">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
