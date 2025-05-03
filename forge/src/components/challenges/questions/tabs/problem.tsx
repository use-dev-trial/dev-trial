import { useEffect, useState } from 'react';

import { useUpsertProblem } from '@/hooks/problems/mutation/upsert';
import { useGetProblemByQuestionId } from '@/hooks/problems/read/single';
import { useQueryClient } from '@tanstack/react-query';

import Loader from '@/components/shared/loader';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

import { Problem } from '@/types/problems';
import { defaultQuestion } from '@/types/questions';
import { GET_SINGLE_PROBLEM_QUERY_KEY_PREFIX } from '@/types/tanstack';

import { useDebouncedCallback } from '@/lib/utils';

interface ProblemTabProps {
  question_id: string;
}

export default function ProblemTab({ question_id }: ProblemTabProps) {
  const queryClient = useQueryClient();

  const { upsertProblem } = useUpsertProblem();
  const [localProblem, setLocalProblem] = useState<Problem | null>(null);
  const { problem: serverProblem, isLoading } = useGetProblemByQuestionId(question_id);

  useEffect(() => {
    if (serverProblem) {
      setLocalProblem(serverProblem);
    }
  }, [serverProblem]);

  const debouncedUpsertProblem = useDebouncedCallback((p: Problem) => upsertProblem(p), 1000);

  function onProblemUpdate(updatedProblem: Problem) {
    setLocalProblem(updatedProblem);
    // optimistic cache update
    queryClient.setQueryData<Problem>(
      [GET_SINGLE_PROBLEM_QUERY_KEY_PREFIX, updatedProblem.id],
      updatedProblem,
    );
    debouncedUpsertProblem(updatedProblem);
  }

  if (!isLoading && !localProblem) {
    defaultQuestion.problem.question_id = question_id;
    onProblemUpdate(defaultQuestion.problem);
  }

  if (isLoading || !localProblem) {
    return <Loader text={'problem'} />;
  }

  const requirements =
    localProblem.requirements.length === 0
      ? ['List your requirements here']
      : localProblem.requirements;

  return (
    <>
      <section>
        <div className="mb-4 flex items-center">
          <p className="text-md font-semibold">Question Description</p>
        </div>
        <Input
          className="rounded-lg leading-relaxed shadow-sm"
          onChange={(e) => onProblemUpdate({ ...localProblem, description: e.target.value })}
          value={localProblem.description}
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
                      ...localProblem,
                      requirements: localProblem.requirements.map((r, i) =>
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
