'use client';

import { Card, CardContent } from '@/components/ui/card';

import { cn } from '@/lib/utils';

interface QuestionTemplateCardProps {
  title: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
}

export default function QuestionTemplateCard({
  title,
  description,
  isSelected,
  onClick,
}: QuestionTemplateCardProps) {
  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:border-blue-500',
        isSelected && 'border-2 border-blue-500',
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <h3 className="font-medium">{title}</h3>
        <p className="text-muted-foreground mt-1 text-sm">{description}</p>
      </CardContent>
    </Card>
  );
}
