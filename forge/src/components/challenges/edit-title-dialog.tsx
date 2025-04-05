import { KeyboardEvent, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface EditChallengeTitleDialogProps {
  isDialogOpen: boolean;
  currentTitle: string;
  onToggle: () => void;
  onSave: (newChallengeTitle: string) => void;
}

export default function RenameChallengeTitleDialog({
  isDialogOpen,
  currentTitle,
  onToggle,
  onSave,
}: EditChallengeTitleDialogProps) {
  const [newChallengeTitle, setNewChallengeTitle] = useState(currentTitle);
  useEffect(() => {
    if (isDialogOpen) {
      setNewChallengeTitle(currentTitle);
    }
  }, [isDialogOpen, currentTitle]);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      if (!newChallengeTitle.trim()) {
        return;
      }
      onSave(newChallengeTitle.trim());
      onToggle();
    }
  };

  const handleSaveClick = () => {
    if (!newChallengeTitle.trim()) {
      return;
    }
    onSave(newChallengeTitle.trim());
    onToggle();
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={onToggle}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rename Challenge</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            value={newChallengeTitle}
            onChange={(e) => setNewChallengeTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter new challenge name"
            className="w-full"
            autoFocus
          />
        </div>
        <DialogFooter className="sm:justify-between">
          <Button type="button" variant="outline" onClick={onToggle}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSaveClick} disabled={!newChallengeTitle.trim()}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
