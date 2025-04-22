'use client';

import { useEffect, useState } from 'react';

import { useMetrics } from '@/hooks/use-metrics';
import { Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';

import { TEMPLATE_METRICS } from '@/lib/constants';
import { useDebouncedCallback } from '@/lib/utils';

export default function SettingsPage() {
  const { upsertMetrics, isPending, error } = useMetrics();
  const [metrics, setMetrics] = useState<Array<{ id: string; content: string; selected: boolean }>>(
    [],
  );

  // Initialize metrics from template
  useEffect(() => {
    setMetrics(
      TEMPLATE_METRICS.map((content, index) => ({
        id: `template-${index}`, // Temporary ID for new metrics
        content,
        selected: false,
      })),
    );
  }, []);

  // Handle metric selection
  const handleSelectMetric = (index: number, checked: boolean) => {
    const updatedMetrics = [...metrics];
    updatedMetrics[index].selected = checked;
    setMetrics(updatedMetrics);

    if (checked) {
      handleUpsertMetric(updatedMetrics[index].id, updatedMetrics[index].content);
    }
  };

  // Handle metric content change
  const handleContentChange = (index: number, content: string) => {
    const updatedMetrics = [...metrics];
    updatedMetrics[index].content = content;
    setMetrics(updatedMetrics);

    debouncedUpsertMetric(updatedMetrics[index].id, content);
  };

  // Add a new metric
  const handleAddMetric = () => {
    setMetrics([
      ...metrics,
      {
        id: `new-${Date.now()}`, // Temporary ID for new metrics
        content: '',
        selected: false,
      },
    ]);
  };

  // Remove a metric
  const handleRemoveMetric = (index: number) => {
    const updatedMetrics = [...metrics];
    updatedMetrics.splice(index, 1);
    setMetrics(updatedMetrics);
  };

  // Handle upsert metric
  function handleUpsertMetric(id: string, content: string) {
    upsertMetrics({
      id:
        id.startsWith('template-') || id.startsWith('new-')
          ? '' // Empty string for fresh inserts
          : id, // Actual ID for updates
      question_id: '2e581ead-b38e-47e1-8bb3-993194b48dd3',
      content: content,
    });
  }

  // Debounced upsert metric
  const debouncedUpsertMetric = useDebouncedCallback(handleUpsertMetric, 1000);

  return (
    <div className="container max-w-2xl space-y-6 py-6">
      <h1 className="text-2xl font-bold">Template Metrics</h1>

      {isPending && <p className="text-muted-foreground text-sm">Saving changes...</p>}
      {error && <p className="text-destructive text-sm">Error: {error.message}</p>}

      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <Card key={metric.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  id={`metric-${index}`}
                  checked={metric.selected}
                  onCheckedChange={(checked) => handleSelectMetric(index, checked as boolean)}
                  className="mt-1"
                />
                <div className="flex-1 space-y-2">
                  <Textarea
                    value={metric.content}
                    onChange={(e) => handleContentChange(index, e.target.value)}
                    className="min-h-[80px] resize-none"
                    placeholder="Enter metric description..."
                    onBlur={() => handleUpsertMetric(metric.id, metric.content)}
                  />
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMetric(index)}
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

        <Button onClick={handleAddMetric} variant="outline" className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add New Metric
        </Button>
      </div>
    </div>
  );
}
