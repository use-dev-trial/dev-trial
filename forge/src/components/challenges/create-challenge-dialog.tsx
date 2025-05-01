import { useRouter } from 'next/navigation';

import { KeyboardEvent, useState } from 'react';

import { useCreateChallenge } from '@/hooks/challenges/mutation/create';
import { toast } from 'sonner';

import Loader from '@/components/shared/loader';
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

import { Challenge, createChallengeRequestSchema } from '@/types/challenges';

import { ROUTES } from '@/lib/constants';

interface CreateChallengeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateChallengeDialog({
  isOpen,
  onOpenChange,
}: CreateChallengeDialogProps) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { createChallenge, isPending, error } = useCreateChallenge();

  const handleCreateChallenge = async () => {
    if (!name.trim() || !description.trim() || isPending) {
      return;
    }

    const createChallengeRequest = createChallengeRequestSchema.parse({
      name: name.trim(),
      description: description.trim(),
    });

    try {
      const createdChallenge: Challenge = await createChallenge(createChallengeRequest);
      onOpenChange(false);
      router.push(ROUTES.QUESTIONS(createdChallenge.id));
    } catch {
      toast("We couldn't create your challenge. Please try again later.");
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && name.trim() && description.trim() && !isPending) {
      handleCreateChallenge();
    }
  };

  if (isPending) {
    return <Loader text={'challenge'} />;
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
              disabled={isPending}
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
              disabled={isPending}
            />
          </div>
        </div>

        {error && <p className="px-4 text-sm text-red-600">Error: {error.message}</p>}

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleCreateChallenge}
            disabled={!name.trim() || !description.trim() || isPending}
          >
            {isPending ? 'Creating...' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
