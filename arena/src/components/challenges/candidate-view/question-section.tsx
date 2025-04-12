import { Question } from '@/types/questions';

interface QuestionSectionProps {
  width: number;
  question?: Question;
}

export function QuestionSection({ width, question }: QuestionSectionProps) {
  // If no question is provided, display default content
  if (!question) {
    return (
      <div
        className="bg-background border-border overflow-y-auto border-r"
        style={{ width: `${width}%` }}
      >
        <div className="p-4">
          <div className="text-muted-foreground mb-4 flex items-center gap-2 text-sm">
            <span>QUESTION DESCRIPTION</span>
          </div>
          <h2 className="text-foreground mb-4 text-2xl font-bold">No Question Available</h2>
          <p className="text-muted-foreground mb-6">There is no question available to display.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-background border-border overflow-y-auto border-r"
      style={{ width: `${width}%` }}
    >
      <div className="p-4">
        <div className="text-muted-foreground mb-4 flex items-center gap-2 text-sm">
          <span>QUESTION DESCRIPTION</span>
        </div>

        <h2 className="text-foreground mb-4 text-2xl font-bold">{question.problem.title}</h2>
        <p className="text-muted-foreground mb-6">{question.problem.description}</p>

        {question.problem.requirements && question.problem.requirements.length > 0 && (
          <>
            <h3 className="text-foreground mb-3 text-xl font-bold">Detailed Requirements</h3>
            <ol className="text-muted-foreground list-decimal space-y-2 pl-6">
              {question.problem.requirements.map((requirement, index) => (
                <li key={index}>{requirement}</li>
              ))}
            </ol>
          </>
        )}
      </div>
    </div>
  );
}
