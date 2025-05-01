'use client';

import { ChangeEvent, KeyboardEvent, useRef, useState } from 'react';

import { useInviteCandidates } from '@/hooks/challenges/mutation/invite';
import { X } from 'lucide-react';
import { toast } from 'sonner';

import Loader from '@/components/shared/loader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { inviteCandidatesRequestSchema } from '@/types/candidates';

import { isValidEmail } from '@/lib/utils';

interface InviteCandidateDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  challengeId: string;
  challengeTitle: string;
}

export default function InviteCandidateDialog({
  isOpen,
  onOpenChange,
  challengeId,
  challengeTitle,
}: InviteCandidateDialogProps) {
  const [currentInput, setCurrentInput] = useState('');
  const [emails, setEmails] = useState<string[]>([]);
  const [inputError, setInputError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { inviteCandidates, isPending, error } = useInviteCandidates();

  const handleAddEmail = (emailToAdd: string) => {
    const trimmedEmail = emailToAdd.trim();
    setInputError(null);

    if (!trimmedEmail) return;

    if (!isValidEmail(trimmedEmail)) {
      setInputError(`"${trimmedEmail}" is not a valid email.`);
      return;
    }

    if (emails.includes(trimmedEmail)) {
      setInputError(`"${trimmedEmail}" has already been added.`);
      return;
    }

    setEmails([...emails, trimmedEmail]);
    setCurrentInput('');
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setEmails(emails.filter((email) => email !== emailToRemove));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentInput(e.target.value);
    if (inputError) {
      setInputError(null);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.altKey && !e.metaKey && !e.shiftKey && !e.ctrlKey) {
      e.preventDefault();
      handleAddEmail(currentInput);
    } else if (e.key === 'Backspace' && currentInput === '' && emails.length > 0) {
      e.preventDefault();
      handleRemoveEmail(emails[emails.length - 1]);
    } else if (e.key === 'Enter' && (e.altKey || e.metaKey)) {
      e.preventDefault();
      if (emails.length > 0 && !isPending) {
        handleSendInvites();
      } else if (currentInput.trim() && !isPending) {
        // If there's text in the input, try adding it first before submitting
        const trimmedEmail = currentInput.trim();
        if (isValidEmail(trimmedEmail) && !emails.includes(trimmedEmail)) {
          const finalEmails = [...emails, trimmedEmail];
          setEmails(finalEmails);
          setCurrentInput('');
          handleSendInvites(finalEmails);
        } else {
          handleAddEmail(currentInput);
        }
      }
    }
  };

  const handleSendInvites = async (finalEmails: string[] = emails) => {
    if (finalEmails.length === 0) {
      toast.error('Please add at least one candidate email.');
      return;
    }

    setInputError(null);
    try {
      const inviteCandidatesRequest = inviteCandidatesRequestSchema.parse({
        challenge_id: challengeId,
        emails: finalEmails,
      });
      await inviteCandidates(inviteCandidatesRequest);
      toast.success(`Invites sent to ${finalEmails.length} candidate(s).`);
    } catch {
      toast.error('Invalid email address.');
    }
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setCurrentInput('');
      setEmails([]);
      setInputError(null);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Invite Candidates</DialogTitle>
          {challengeTitle && (
            <DialogDescription>
              Invite candidates to take the {challengeTitle} challenge.
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="email-input" className="sr-only text-sm font-medium">
              Candidate Emails
            </Label>
            <div
              className="border-input bg-background flex min-h-[40px] cursor-text flex-wrap items-center gap-1 rounded-md border p-2"
              onClick={handleContainerClick}
            >
              {emails.map((email) => (
                <Badge
                  key={email}
                  variant="secondary"
                  className="flex items-center gap-1 whitespace-nowrap"
                >
                  {email}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveEmail(email);
                    }}
                    className="hover:bg-muted-foreground/20 focus:ring-ring rounded-full p-0.5 focus:ring-1 focus:outline-none"
                    aria-label={`Remove ${email}`}
                    disabled={isPending}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              <Input
                ref={inputRef}
                id="email-input"
                type="email"
                value={currentInput}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={emails.length === 0 ? 'Enter candidate email(s)...' : ''}
                className="h-auto min-w-[100px] flex-1 border-none bg-transparent p-0 shadow-none focus-visible:ring-0" // Style to blend in
                disabled={isPending}
                autoFocus
              />
            </div>
            {inputError && <p className="px-1 text-xs text-red-600">{inputError}</p>}
          </div>
        </div>
        {error && <p className="px-1 text-sm text-red-600">Error: {error.message}</p>}
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={() => handleSendInvites()}
            disabled={emails.length === 0 || isPending}
          >
            {isPending ? (
              <>
                <Loader text={''} />
              </>
            ) : (
              `Invite ${emails.length} Candidate${emails.length !== 1 ? 's' : ''}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
