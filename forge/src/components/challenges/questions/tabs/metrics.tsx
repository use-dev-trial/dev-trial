'use client';

import { useDeleteMetric } from '@/hooks/metrics/mutation/delete';
import { useUpsertMetric } from '@/hooks/metrics/mutation/upsert';
import { useGetAllMetrics } from '@/hooks/metrics/read/all';
import { Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

import { Metric, upsertMetricRequestSchema } from '@/types/metrics';

import { useDebouncedCallback } from '@/lib/utils';

interface MetricsTabProps {
  question_id: string;
}

export default function MetricsTab({ question_id }: MetricsTabProps) {
  const { metrics } = useGetAllMetrics(question_id);
  const { upsertMetric } = useUpsertMetric();
  const { deleteMetric } = useDeleteMetric();

  function handleUpsertMetric(updatedMetric: Metric) {
    const upsertMetricRequest = upsertMetricRequestSchema.parse({
      ...updatedMetric,
      question_id: question_id,
    });
    upsertMetric(upsertMetricRequest);
  }

  const handleDeleteMetric = (id: string) => {
    deleteMetric(id);
  };

  const debouncedUpsertMetric = useDebouncedCallback(handleUpsertMetric, 1000);
  const debouncedDeleteMetric = useDebouncedCallback(handleDeleteMetric, 1000);

  const onUpdateMetric = (index: number, content: string) => {
    const updatedMetrics = [...metrics];
    updatedMetrics[index].content = content;
    debouncedUpsertMetric(updatedMetrics[index]);
  };

  const onDeleteMetric = (index: number) => {
    const updatedMetrics = [...metrics];
    const deletedMetric: Metric = updatedMetrics[index];
    updatedMetrics.splice(index, 1);
    debouncedDeleteMetric(deletedMetric.id);
  };

  const onAddMetric = () => {
    const newMetric: Metric = {
      id: '',
      content: '',
    };
    debouncedUpsertMetric(newMetric);
  };

  return (
    <div className="container max-w-2xl space-y-6 py-6">
      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <Card key={metric.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-1 space-y-2">
                  <Textarea
                    value={metric.content}
                    onChange={(e) => onUpdateMetric(index, e.target.value)}
                    className="min-h-[80px] resize-none"
                    placeholder="Enter metric description..."
                    onBlur={() => handleUpsertMetric(metric)}
                  />
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteMetric(index)}
                      className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                    >
                      <Trash2 className="mr-1 h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Button onClick={onAddMetric} variant="outline" className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add New Metric
        </Button>
      </div>
    </div>
  );
}
