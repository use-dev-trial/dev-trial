interface QuestionSectionProps {
  width: number;
}

export function QuestionSection({ width }: QuestionSectionProps) {
  return (
    <div
      className="overflow-y-auto border-r border-gray-200 dark:border-gray-800"
      style={{ width: `${width}%` }}
    >
      <div className="p-4">
        <div className="mb-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>QUESTION DESCRIPTION</span>
        </div>

        <h2 className="mb-4 text-2xl font-bold dark:text-white">Code Review Feedback</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          Your task is to create a React application called &quot;Code Review Feedback&quot; that
          tracks and manages feedback on various aspects of code quality. The component should have
          upvote and downvote functionality for each aspect, and it must meet all specified
          requirements.
        </p>

        <h3 className="mb-3 text-xl font-bold dark:text-white">Detailed Requirements</h3>
        <ol className="list-decimal space-y-2 pl-6 dark:text-gray-300">
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
