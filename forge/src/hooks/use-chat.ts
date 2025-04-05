'use client';

import { useState } from 'react';

import { send } from '@/actions/messages';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { File } from '@/types/files';
import {
  Message,
  MessageRequest,
  MessageResponse,
  messageRequestSchema,
  role,
} from '@/types/messages';
import { Problem } from '@/types/problems';
import { Question, TestCase, defaultQuestion } from '@/types/questions';

export type Tab = 'problem' | 'files' | 'test-cases';

const isProblemUpdated = (q1: Problem, q2: Problem): boolean => {
  // Dont account for id changes as we do not want to account for manual changes by the user
  return (
    q1.title !== q2.title ||
    q1.description !== q2.description ||
    q1.requirements !== q2.requirements
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

export function useChat() {
  const [question, setQuestion] = useState<Question>(defaultQuestion);
  const [messages, setMessages] = useState<Message[]>([]);
  const [lastMessageId, setLastMessageId] = useState<string>('');
  const [updatedTabs, setUpdatedTabs] = useState<Tab[]>([]);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (params: { content: string; id?: string }) => {
      const messageRequest: MessageRequest = messageRequestSchema.parse({
        content: params.content,
        id: params.id || lastMessageId,
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
      const tabs: Tab[] = [];

      if (isProblemUpdated(question.problem, data.question.problem)) {
        tabs.push('problem');
      }

      if (areFilesUpdated(question.files, data.question.files)) {
        tabs.push('files');
      }

      if (areTestCasesUpdated(question.test_cases, data.question.test_cases)) {
        tabs.push('test-cases');
      }
      setUpdatedTabs(tabs);
      setQuestion(data.question);

      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
    onError: (error) => {
      console.error('Error sending message:', error);
    },
  });

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    mutation.mutate({ content, id: lastMessageId });
  };

  const clearUpdatedTab = (tab: Tab) => {
    setUpdatedTabs((prev) => prev.filter((t: Tab) => t !== tab));
  };

  return {
    question,
    messages,
    isLoading: mutation.isPending,
    updatedTabs,
    sendMessage,
    setQuestion,
    clearUpdatedTab,
  };
}
