'use client';

import { useState } from 'react';

import { send } from '@/actions/messages';

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    setIsLoading(true);
    setError(null);

    const userMessage: Message = { role: role.Values.user, content };
    addMessage(userMessage);

    try {
      const messageRequest: MessageRequest = messageRequestSchema.parse({ content });
      const messageResponse: MessageResponse = await send(messageRequest);
      const assistantMessage: Message = {
        role: role.Values.assistant,
        content: messageResponse.content,
      };
      addMessage(assistantMessage);
      if (onResponse) {
        onResponse(assistantMessage);
      }
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
  };
}
