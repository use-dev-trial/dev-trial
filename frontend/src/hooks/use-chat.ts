'use client';

import { useState } from 'react';

import { send } from '@/actions/messages';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  Message,
  MessageRequest,
  MessageResponse,
  messageRequestSchema,
  role,
} from '@/lib/messages';
import { Question } from '@/lib/question';

// Define the tabs that can be updated
export type UpdatedTab = 'question' | 'files' | 'test-cases';

interface UseChatOptions {
  initialMessages?: Message[];
  onResponse?: (message: Message, messageId?: string) => void;
  onQuestionUpdate?: (update: Question, updatedTabs: UpdatedTab[]) => void;
}

export function useChat({
  initialMessages = [],
  onResponse,
  onQuestionUpdate,
}: UseChatOptions = {}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [lastMessageId, setLastMessageId] = useState<string | null>(null);
  const [updatedTabs, setUpdatedTabs] = useState<UpdatedTab[]>([]);
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

      if (onResponse) {
        onResponse(assistantMessage, data.id);
      }

      if (data.question && onQuestionUpdate) {
        // Determine which tabs were updated
        const tabs: UpdatedTab[] = [];

        if (data.question.problem) {
          tabs.push('question');
        }

        if (data.question.files) {
          tabs.push('files');
        }

        if (data.question.test_cases) {
          tabs.push('test-cases');
        }

        // Only update if we have tabs to update and a callback
        if (tabs.length > 0) {
          // Update the state with the newly updated tabs, but only if they're new
          setUpdatedTabs((prev) => {
            // Create a new Set to ensure uniqueness
            const newSet = new Set([...prev, ...tabs]);
            const uniqueTabs = Array.from(newSet);

            // Only return a new array if there are actually new tabs
            return uniqueTabs.length !== prev.length ? uniqueTabs : prev;
          });

          // Pass both the question and updated tabs to the callback
          onQuestionUpdate(data.question, tabs);
        }
      }

      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
    onError: (error) => {
      console.error('Error sending message:', error);
    },
  });

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    mutation.mutate({ content, id: lastMessageId || undefined });
  };

  // Add function to clear a tab from the updated tabs list
  const clearUpdatedTab = (tab: UpdatedTab) => {
    setUpdatedTabs((prev) => prev.filter((t) => t !== tab));
  };

  // Add function to clear all updated tabs
  const clearAllUpdatedTabs = () => {
    setUpdatedTabs([]);
  };

  return {
    messages,
    isLoading: mutation.isPending,
    error: mutation.error,
    sendMessage,
    lastMessageId,
    updatedTabs,
    clearUpdatedTab,
    clearAllUpdatedTabs,
  };
}
