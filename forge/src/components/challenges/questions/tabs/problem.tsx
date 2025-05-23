import { useUpsertProblem } from '@/hooks/problems/mutation/upsert';

import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

import { Problem } from '@/types/problems';

import { useDebouncedCallback } from '@/lib/utils';

interface ProblemTabProps {
  problem: Problem;
}

export default function ProblemTab({ problem }: ProblemTabProps) {
  const { upsertProblem } = useUpsertProblem();
  const handleUpsertProblem = (input: Problem) => {
    upsertProblem(input);
  };

  const debouncedUpsertProblem = useDebouncedCallback(handleUpsertProblem, 1000);

  const onProblemUpdate = async (input: Problem) => {
    debouncedUpsertProblem(input);
  };

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
                <Input
                  value={requirement}
                  onChange={(e) =>
                    onProblemUpdate({
                      ...problem,
                      requirements: problem.requirements.map((r, i) =>
                        i === index ? e.target.value : r,
                      ),
                    })
                  }
                />
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
