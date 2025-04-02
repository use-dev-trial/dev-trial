'use client';

import type React from 'react';
import { useEffect, useRef, useState } from 'react';

import { Tab } from '@/hooks/use-chat';
import { Bot, Loader2, Paperclip, Send, User } from 'lucide-react';

import SuggestionCard from '@/components/challenges/create/suggestion-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Message } from '@/types/messages';

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  updatedTabs: Tab[];
  onSendMessage: (message: string) => void;
}

export default function ChatInterface({
  messages,
  isLoading,
  updatedTabs,
  onSendMessage,
}: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  // Auto-scroll to bottom when messages change or loading state changes
  useEffect(() => {
    if (messagesEndRef.current && messagesContainerRef.current) {
      const scrollToBottom = () => {
        messagesContainerRef.current!.scrollTop = messagesContainerRef.current!.scrollHeight;
      };

      // Use requestAnimationFrame for smoother scrolling after render is complete
      window.requestAnimationFrame(scrollToBottom);
    }
  }, [messages, isLoading]);

  // Helper function to get friendly tab name
  const getTabDisplayName = (tab: Tab): string => {
    switch (tab) {
      case 'problem':
        return 'Problem';
      case 'files':
        return 'Files';
      case 'test-cases':
        return 'Test Cases';
      default:
        return tab;
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div ref={messagesContainerRef} className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="mt-8 text-center">
            <p className="mb-6 text-sm">
              Start by describing your coding interview question similar to the examples below.
            </p>
            <div className="flex flex-col space-y-2">
              <SuggestionCard
                message="Create a question about building a React component for code review feedback"
                onSendMessage={onSendMessage}
                isLoading={isLoading}
              >
                Create a question about building a React component for code review feedback
              </SuggestionCard>
              <SuggestionCard
                message="Add a requirement about upvote and downvote functionality"
                onSendMessage={onSendMessage}
                isLoading={isLoading}
              >
                Add a requirement about upvote and downvote functionality
              </SuggestionCard>
              <SuggestionCard
                message="Update the description to include tracking code quality metrics"
                onSendMessage={onSendMessage}
                isLoading={isLoading}
              >
                Update the description to include tracking code quality metrics
              </SuggestionCard>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div key={index} className="flex items-start space-x-2">
              <div
                className={`flex-shrink-0 rounded-full p-1.5 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-red-600 to-yellow-400'
                    : 'bg-gradient-to-br from-blue-500 to-blue-100'
                }`}
              >
                {message.role === 'user' ? (
                  <User className="h-3.5 w-3.5 text-white" />
                ) : (
                  <Bot className="h-3.5 w-3.5 text-white" />
                )}
              </div>
              <div
                className={`max-w-[85%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'shadow-sm'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex items-start space-x-2">
            <div className="flex-shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-blue-100 p-1.5">
              <Bot className="h-3.5 w-3.5" />
            </div>
            <div className="flex items-center space-x-2 rounded-lg p-3 shadow-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="animate-pulse text-sm">thinking...</span>
            </div>
          </div>
        )}
        {updatedTabs.length > 0 && (
          <div className="sticky right-0 bottom-0 mb-3 flex items-center justify-center">
            <div className="rounded-lg bg-amber-100 px-3 py-1.5 text-xs font-medium text-amber-800 shadow-sm">
              {updatedTabs.map(getTabDisplayName).join(', ')} Updated
              <span className="ml-1.5 inline-flex h-2 w-2 animate-pulse rounded-full bg-amber-500"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex flex-col rounded-lg border focus-within:ring-2 focus-within:ring-gray-400/50">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={messages.length > 0 ? 'Ask a follow up...' : 'Type your message...'}
              className="min-h-20 w-full resize-none self-start rounded-lg border-0 px-4 py-3 text-sm shadow-none outline-none placeholder:text-gray-500 focus-visible:border-0 focus-visible:ring-0"
              disabled={isLoading}
              rows={1}
              style={{ height: 'auto', minHeight: '80px' }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${Math.max(80, target.scrollHeight)}px`;
              }}
            />
            <div className="flex justify-end space-x-1 pr-2 pb-2">
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                disabled={isLoading}
              >
                <Paperclip size={16} />
              </Button>
              <Button
                type="submit"
                size="icon"
                className="h-7 w-7 rounded-md bg-gray-700 hover:bg-gray-600"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
