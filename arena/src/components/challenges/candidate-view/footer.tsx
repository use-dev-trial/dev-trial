import { Button } from '@/components/ui/button';

export function Footer() {
  return (
    <div className="bg-background border-border flex items-end justify-end border-t px-4 py-2">
      <div className="flex items-end gap-2">
        <Button variant="outline" className="px-4 py-2 text-sm">
          Run Tests
        </Button>
        <Button className="px-4 py-2 text-sm">Submit Code</Button>
      </div>
    </div>
  );
}
