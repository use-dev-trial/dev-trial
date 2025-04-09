'use client';

import { useState } from 'react';

import { CircleX } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DeleteQuestionDialogProps {
  onConfirmBtnClick: () => void;
}
export default function DeleteQuestionDialog({ onConfirmBtnClick }: DeleteQuestionDialogProps) {
  const [open, setOpen] = useState(false);
  return (
    <TooltipProvider>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full hover:bg-gray-300 dark:hover:bg-gray-600"
                aria-label="Add new question"
                onClick={() => setOpen(true)}
              >
                <CircleX size={16} />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p className="text-sm">Delete this question</p>
            </TooltipContent>
          </Tooltip>
        </DialogTrigger>

        <DialogContent className="flex max-h-[80vh] flex-col sm:max-w-[50vw]">
          <DialogHeader>
            <DialogTitle className="text-center">
              WARNING: You are about to delete this question
            </DialogTitle>
          </DialogHeader>
          <Button
            className="bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
            onClick={() => {
              onConfirmBtnClick();
              setOpen(false);
            }}
          >
            Confirm Deletion
          </Button>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
