import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

import { Problem } from '@/types/problems';

interface ProblemTabProps {
  problem: Problem;
  onProblemUpdate: (input: Problem) => void;
}

export default function ProblemTab({ problem, onProblemUpdate }: ProblemTabProps) {
  const requirements =
    problem.requirements.length === 0 ? ['List your requirements here'] : problem.requirements;
  return (
    <>
      <section>
        <div className="mb-4 flex items-center">
          <p className="text-md font-semibold">Question Description</p>
        </div>
        <Input
          className="rounded-lg leading-relaxed shadow-sm"
          onChange={(e) => onProblemUpdate({ ...problem, description: e.target.value })}
          value={problem.description || 'Add a description for your coding interview question.'}
        />
      </section>

      <section>
        <div className="mb-4 flex items-center">
          <p className="text-md font-semibold">Detailed Requirements</p>
        </div>
        <div className="rounded-lg border p-5 shadow-sm">
          <ol className="list-none space-y-3">
            {requirements.map((requirement, index) => (
              <li key={index} className="flex items-start">
                <Badge
                  variant="outline"
                  className="mt-0.5 mr-2 border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-50"
                >
                  {index + 1}
                </Badge>
                <span>{requirement}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
