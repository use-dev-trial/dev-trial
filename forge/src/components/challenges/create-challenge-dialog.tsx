import { KeyboardEvent, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface CreateChallengeDialogProps {
  isOpen: boolean;
  isLoading: boolean;
  error: Error | null;
  onOpenChange: (open: boolean) => void;
  onCreateChallengeBtnClick: (challengeName: string, challengeDescription: string) => void;
}

export default function CreateChallengeDialog({
  isOpen,
  isLoading,
  error,
  onOpenChange,
  onCreateChallengeBtnClick,
}: CreateChallengeDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && name.trim() && description.trim() && !isLoading) {
      onCreateChallengeBtnClick(name, description);
    }
  };

  if (isLoading) {
    return;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Challenge</DialogTitle>
        </DialogHeader>
        {/* Form Content */}
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Python Decorator Challenge"
              className="w-full"
              autoFocus
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Best practices surrounding Python decorator usage"
              className="w-full"
              disabled={isLoading}
            />
          </div>
        </div>

        {error && <p className="px-4 text-sm text-red-600">Error: {error.message}</p>}

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isLoading}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={() => onCreateChallengeBtnClick(name, description)}
            disabled={!name.trim() || !description.trim() || isLoading}
          >
            {isLoading ? 'Creating...' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
