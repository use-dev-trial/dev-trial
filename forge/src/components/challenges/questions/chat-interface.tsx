'use client';

import type React from 'react';
import { useEffect, useRef, useState } from 'react';

import { QuestionPreviewTabName } from '@/hooks/use-chat';
import { Bot, Loader2, Send, User } from 'lucide-react';

import SuggestionCard from '@/components/challenges/questions/suggestion-card';
import { Button } from '@/components/ui/button';

import { Message, role } from '@/types/messages';

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  updatedTabs: QuestionPreviewTabName[];
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const triggerSendMessage = () => {
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = '80px';
      }
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerSendMessage();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault(); // Prevent adding a newline character
      triggerSendMessage();
    }
  };

  useEffect(() => {
    if (messagesEndRef.current && messagesContainerRef.current) {
      const scrollToBottom = () => {
        messagesContainerRef.current!.scrollTop = messagesContainerRef.current!.scrollHeight;
      };
      const rafId = window.requestAnimationFrame(scrollToBottom);
      return () => window.cancelAnimationFrame(rafId);
    }
  }, [messages, isLoading]);

  const getTabDisplayName = (tab: QuestionPreviewTabName): string => {
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

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const target = e.target as HTMLTextAreaElement;
    target.style.height = 'auto';
    target.style.height = `${Math.max(80, target.scrollHeight)}px`;
  };

  return (
    <div className="flex h-full flex-col">
      <div ref={messagesContainerRef} className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.length === 0 && !isLoading && (
          <div className="mt-8 text-center">
            <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
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
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start space-x-3 ${message.role === 'user' ? 'justify-end' : ''}`}
          >
            {message.role === role.Values.assistant && (
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-300">
                <Bot className="h-4 w-4 text-white" />
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                message.role === role.Values.user
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-800 shadow-sm dark:bg-gray-700 dark:text-gray-200'
              }`}
            >
              {message.content}
            </div>
            {message.role === role.Values.user && (
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-yellow-400">
                <User className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-300 p-1.5">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="flex items-center space-x-2 rounded-lg bg-gray-100 px-3 py-2 text-sm shadow-sm dark:bg-gray-700">
              <Loader2 className="h-4 w-4 animate-spin text-gray-600 dark:text-gray-400" />
              <span className="animate-pulse text-sm text-gray-600 dark:text-gray-400">
                thinking...
              </span>
            </div>
          </div>
        )}

        {updatedTabs.length > 0 && !isLoading && (
          <div className="sticky bottom-2 flex items-center justify-center px-4">
            <div className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800 shadow-sm dark:bg-amber-900/50 dark:text-amber-300">
              {updatedTabs.map(getTabDisplayName).join(', ')} Updated
              <span className="ml-1.5 inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4 dark:border-gray-700">
        <form onSubmit={handleFormSubmit} className="relative">
          <div className="flex flex-col overflow-hidden rounded-lg border focus-within:ring-2 focus-within:ring-blue-500/50 dark:border-gray-600 dark:focus-within:ring-blue-400/40">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleTextareaInput}
              onKeyDown={handleKeyDown}
              placeholder={
                messages.length > 0 ? 'Ask a follow up...' : 'Describe your coding question...'
              }
              className="w-full resize-none rounded-lg border-0 bg-transparent p-2 px-4 py-3 text-sm outline-none placeholder:text-gray-500 focus:ring-0 focus-visible:ring-0 dark:text-gray-100 dark:placeholder:text-gray-400"
              disabled={isLoading}
              rows={1}
              style={{ minHeight: '80px', maxHeight: '200px' }}
            />
            <div className="flex items-center justify-end space-x-1 border-t p-2 dark:border-gray-600">
              <Button
                type="submit"
                size="icon"
                className="h-8 w-8 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
                disabled={isLoading || !input.trim()}
                aria-label="Send message"
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
