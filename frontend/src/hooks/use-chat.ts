'use client';

import { useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

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

    // Add user message
    const userMessage: Message = { role: 'user', content };
    addMessage(userMessage);

    try {
      // In a real implementation, this would call an API
      // For now, we'll simulate a response
      setTimeout(() => {
        const assistantMessage: Message = {
          role: 'assistant',
          content: `I've processed your message: "${content}"`,
        };

        addMessage(assistantMessage);

        if (onResponse) {
          onResponse(assistantMessage);
        }

        setIsLoading(false);
      }, 1000);
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
