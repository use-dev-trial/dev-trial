'use client';

import type React from 'react';
import { useEffect, useRef, useState } from 'react';

import { Bot, Loader2, Send, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Message } from '@/lib/messages';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

export default function ChatInterface({
  messages,
  onSendMessage,
  isLoading = false,
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

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex h-full flex-col">
      <div ref={messagesContainerRef} className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="mt-8 text-center text-gray-500">
            <p className="mb-2">Start by describing your coding interview question.</p>
            <p className="mb-3 text-sm">For example:</p>
            <div className="flex flex-col space-y-2">
              <Button
                variant="outline"
                className="h-auto w-full justify-start py-3 text-left text-sm font-normal whitespace-normal transition-colors hover:bg-slate-100"
                onClick={() =>
                  onSendMessage(
                    'Create a question about building a React component for code review feedback',
                  )
                }
                disabled={isLoading}
              >
                Create a question about building a React component for code review feedback
              </Button>
              <Button
                variant="outline"
                className="h-auto w-full justify-start py-3 text-left text-sm font-normal whitespace-normal transition-colors hover:bg-slate-100"
                onClick={() =>
                  onSendMessage('Add a requirement about upvote and downvote functionality')
                }
                disabled={isLoading}
              >
                Add a requirement about upvote and downvote functionality
              </Button>
              <Button
                variant="outline"
                className="h-auto w-full justify-start py-3 text-left text-sm font-normal whitespace-normal transition-colors hover:bg-slate-100"
                onClick={() =>
                  onSendMessage('Update the description to include tracking code quality metrics')
                }
                disabled={isLoading}
              >
                Update the description to include tracking code quality metrics
              </Button>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div key={index} className="flex items-start space-x-2">
              <div
                className={`flex-shrink-0 rounded-full p-1.5 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-pink-400 to-yellow-400'
                    : 'bg-gradient-to-br from-blue-400 to-green-400'
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
                    : 'bg-gray-100 text-gray-800 shadow-sm'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex items-start space-x-2">
            <div className="flex-shrink-0 rounded-full bg-gradient-to-br from-blue-400 to-green-400 p-1.5">
              <Bot className="h-3.5 w-3.5 text-white" />
            </div>
            <div className="flex items-center space-x-2 rounded-lg bg-gray-100 p-3 text-gray-800 shadow-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Processing your request...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 bg-white p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={messages.length > 0 ? 'Ask followup...' : 'Type your message...'}
            className="flex-1"
            disabled={isLoading}
          />
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="hover:bg-slate-100"
            disabled={isLoading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-paperclip"
            >
              <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
            </svg>
          </Button>
          <Button type="submit" size="icon" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
