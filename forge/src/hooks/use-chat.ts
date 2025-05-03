'use client';

import { useState } from 'react';

import { send } from '@/actions/messages';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { File } from '@/types/files';
import {
  Message,
  MessageRequest,
  MessageResponse,
  messageRequestSchema,
  role,
} from '@/types/messages';
import { Problem } from '@/types/problems';
import { Question, defaultQuestion } from '@/types/questions';
import { TestCase } from '@/types/test_cases';

export const questionPreviewTabName = z.enum(['problem', 'files', 'test-cases', 'metrics']);
export type QuestionPreviewTabName = z.infer<typeof questionPreviewTabName>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function areArraysEqual(arr1: any[], arr2: any[]): boolean {
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
    return arr1 === arr2;
  }

  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    // This comparison assumes elements are primitives or objects where reference equality is sufficient.
    // If elements are objects needing deep comparison, this line needs to change.
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
}

const isProblemUpdated = (q1: Problem, q2: Problem): boolean => {
  // Dont account for id changes as we do not want to account for manual changes by the user
  return (
    q1.title !== q2.title ||
    q1.description !== q2.description ||
    !areArraysEqual(q1.requirements, q2.requirements)
  );
};

const areFilesUpdated = (f1: File[], f2: File[]): boolean => {
  // Dont account for id changes as we do not want to account for manual changes by the user
  if (f1.length !== f2.length) {
    return true;
  }
  for (let i = 0; i < f1.length; i++) {
    if (f1[i].name !== f2[i].name || f1[i].code !== f2[i].code) {
      return true;
    }
  }
  return false;
};

const areTestCasesUpdated = (t1: TestCase[], t2: TestCase[]): boolean => {
  // Dont account for id changes as we do not want to account for manual changes by the user
  if (t1.length !== t2.length) {
    return true;
  }
  for (let i = 0; i < t1.length; i++) {
    if (t1[i].description !== t2[i].description) {
      return true;
    }
  }
  return false;
};

interface UseChatProps {
  challenge_id: string;
  question: Question;
}

export function useChat({ challenge_id, question }: UseChatProps) {
  const [updatedQuestion, setUpdatedQuestion] = useState<Question>(defaultQuestion);
  const [messages, setMessages] = useState<Message[]>([]);
  const [lastMessageId, setLastMessageId] = useState<string>('');
  const [updatedTabs, setUpdatedTabs] = useState<QuestionPreviewTabName[]>([]);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (params: { content: string }) => {
      const messageRequest: MessageRequest = messageRequestSchema.parse({
        id: lastMessageId,
        challenge_id: challenge_id,
        question_id: question.id,
        content: params.content,
      });
      return await send(messageRequest);
    },
    onMutate: (params) => {
      const userMessage: Message = { role: role.Values.user, content: params.content };
      setMessages((prev) => [...prev, userMessage]);
    },
    onSuccess: (data: MessageResponse) => {
      const assistantMessage: Message = {
        role: role.Values.assistant,
        content: data.content,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setLastMessageId(data.id);

      // Determine which tabs were updated
      const tabs: QuestionPreviewTabName[] = [];

      if (isProblemUpdated(question.problem, data.question.problem)) {
        tabs.push(questionPreviewTabName.Values.problem);
      }

      if (areFilesUpdated(question.files, data.question.files)) {
        tabs.push(questionPreviewTabName.Values.files);
      }

      if (areTestCasesUpdated(question.test_cases, data.question.test_cases)) {
        tabs.push(questionPreviewTabName.Values['test-cases']);
      }
      setUpdatedQuestion(data.question);
      setUpdatedTabs(tabs);

      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
    onError: (error) => {
      console.error('Error sending message:', error);
    },
  });

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    mutation.mutate({ content });
  };

  const clearUpdatedTab = (tab: QuestionPreviewTabName) => {
    setUpdatedTabs((prev) => prev.filter((t: QuestionPreviewTabName) => t !== tab));
  };

  return {
    updatedQuestion,
    messages,
    isLoading: mutation.isPending,
    updatedTabs,
    sendMessage,
    clearUpdatedTab,
  };
}
