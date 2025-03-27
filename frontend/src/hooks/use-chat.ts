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

interface UseChatOptions {
  initialMessages?: Message[];
  onResponse?: (message: Message) => void;
}

export function useChat({ initialMessages = [], onResponse }: UseChatOptions = {}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (content: string) => {
      const messageRequest: MessageRequest = messageRequestSchema.parse({ content });
      return await send(messageRequest);
    },
    onMutate: (content) => {
      const userMessage: Message = { role: role.Values.user, content };
      setMessages((prev) => [...prev, userMessage]);
    },
    onSuccess: (data: MessageResponse) => {
      const assistantMessage: Message = {
        role: role.Values.assistant,
        content: data.content,
      };
      setMessages((prev) => [...prev, assistantMessage]);

      if (onResponse) {
        onResponse(assistantMessage);
      }

      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
    onError: (error) => {
      console.error('Error sending message:', error);
    },
  });

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    mutation.mutate(content);
  };

  return {
    messages,
    isLoading: mutation.isPending,
    error: mutation.error,
    sendMessage,
  };
}
