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

interface UseChatOptions {
  initialMessages?: Message[];
  onResponse?: (message: Message, messageId?: string) => void;
  onQuestionUpdate?: (update: Question) => void;
}

export function useChat({
  initialMessages = [],
  onResponse,
  onQuestionUpdate,
}: UseChatOptions = {}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [lastMessageId, setLastMessageId] = useState<string | null>(null);
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
        onQuestionUpdate(data.question);
      }

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

  return {
    messages,
    isLoading: mutation.isPending,
    error: mutation.error,
    sendMessage,
    lastMessageId,
  };
}
