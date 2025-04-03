import { Plus } from 'lucide-react';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AddQuestionTooltipProps {
  onClick: () => void;
}

export default function AddQuestionTooltip({ onClick }: AddQuestionTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div
            onClick={onClick}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            aria-label="Add new question"
          >
            <Plus size={16} />
          </div>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p className="text-sm">Add new question</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
