interface QuestionSectionProps {
  width: number;
}

export function QuestionSection({ width }: QuestionSectionProps) {
  return (
    <div
      className="bg-background border-border overflow-y-auto border-r"
      style={{ width: `${width}%` }}
    >
      <div className="p-4">
        <div className="text-muted-foreground mb-4 flex items-center gap-2 text-sm">
          <span>QUESTION DESCRIPTION</span>
        </div>

        <h2 className="text-foreground mb-4 text-2xl font-bold">Code Review Feedback</h2>
        <p className="text-muted-foreground mb-6">
          Your task is to create a React application called &quot;Code Review Feedback&quot; that
          tracks and manages feedback on various aspects of code quality. The component should have
          upvote and downvote functionality for each aspect, and it must meet all specified
          requirements.
        </p>

        <h3 className="text-foreground mb-3 text-xl font-bold">Detailed Requirements</h3>
        <ol className="text-muted-foreground list-decimal space-y-2 pl-6">
          <li>
            The CodeReviewFeedback component displays five aspects: Readability, Performance,
            Security, Documentation, and Testing.
          </li>
          <li>
            Each aspect has two buttons labeled &quot;Upvote&quot; and &quot;Downvote&quot; to allow
            users to vote.
          </li>
          <li>The initial count for upvotes and downvotes for each aspect is 0.</li>
          <li>
            When a user clicks the &quot;Upvote&quot; button, the upvote count for that aspect
            increases by 1.
          </li>
          <li>
            When a user clicks the &quot;Downvote&quot; button, the downvote count for that aspect
            by 1.
          </li>
        </ol>
      </div>
    </div>
  );
}
