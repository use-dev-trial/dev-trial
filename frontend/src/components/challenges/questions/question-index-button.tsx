import { Button } from '@/components/ui/button';

interface QuestionIndexButtonProps {
  isSelected: boolean;
  index: number;
  onClick: (idx: number) => void;
}

export default function QuestionIndexButton({
  isSelected,
  index,
  onClick,
}: QuestionIndexButtonProps) {
  return (
    <Button
      key={index}
      onClick={() => onClick(index)}
      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
        isSelected
          ? 'bg-blue-500 text-white'
          : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
      }`}
      aria-label={`Question ${index + 1}`}
    >
      {index + 1}
    </Button>
  );
}
