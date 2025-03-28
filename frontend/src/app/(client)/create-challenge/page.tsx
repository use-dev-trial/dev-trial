'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { useChat } from '@/hooks/use-chat';

import ChatInterface from '@/components/create-challenge/chat-interface';
import QuestionPreview from '@/components/create-challenge/question-preview';

import { Message, QuestionUpdate } from '@/lib/messages';

export default function Home() {
  const [question, setQuestion] = useState({
    title: 'Untitled Question',
    description: 'Add a description for your coding interview question.',
    requirements: ['List your requirements here'],
    sampleInteractions: [
      { title: 'Initial State', steps: ['Describe the initial state'] },
      { title: 'User Action 1', steps: ['Describe user action 1'] },
    ],
  });

  // Track which sections were updated for animations
  const [updatedSections, setUpdatedSections] = useState<string[]>([]);

  // Reference to preserve scroll position
  const previewContainerRef = useRef<HTMLDivElement>(null);

  // Clear updated sections after animations complete
  useEffect(() => {
    if (updatedSections.length > 0) {
      const timer = setTimeout(() => {
        setUpdatedSections([]);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [updatedSections]);

  // Handle AI responses to update the question
  const handleResponse = useCallback((message: Message) => {
    // Log the received message for debugging purposes
    console.log(message);
  }, []);

  // Handle question updates while preserving scroll position
  const handleQuestionUpdate = useCallback((update: QuestionUpdate, updatedSects?: string[]) => {
    // Store the current scroll position
    const scrollPosition = previewContainerRef.current?.scrollTop || 0;

    // Update the question
    setQuestion((prevQuestion) => ({
      ...prevQuestion,
      ...(update.title && { title: update.title }),
      ...(update.description && { description: update.description }),
      ...(update.requirements && { requirements: update.requirements }),
      ...(update.sampleInteractions && { sampleInteractions: update.sampleInteractions }),
    }));

    // Set updated sections for animations
    if (updatedSects && updatedSects.length > 0) {
      setUpdatedSections(updatedSects);
    }

    // Restore scroll position after state updates
    setTimeout(() => {
      if (previewContainerRef.current) {
        previewContainerRef.current.scrollTop = scrollPosition;
      }
    }, 0);
  }, []);

  const { messages, sendMessage, isLoading } = useChat({
    onResponse: handleResponse,
    onQuestionUpdate: handleQuestionUpdate,
  });

  return (
    <main className="flex h-screen bg-slate-50">
      <div className="flex w-3/10 flex-col border-r border-gray-200 bg-white">
        <div className="border-b border-gray-200 bg-white p-4">
          <h2 className="text-xl font-semibold">Interview Question Generator</h2>
          <p className="text-sm text-gray-500">
            Chat to create and modify your coding interview question
          </p>
        </div>
        <div className="flex-1 overflow-hidden">
          <ChatInterface messages={messages} onSendMessage={sendMessage} isLoading={isLoading} />
        </div>
      </div>
      <div ref={previewContainerRef} className="w-7/10 overflow-auto bg-white">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white p-4">
          <h2 className="text-xl font-semibold">Question Preview</h2>
          {isLoading && (
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-blue-500"></span>
              <span>Updating question...</span>
            </div>
          )}
        </div>
        <QuestionPreview question={question} updatedSections={updatedSections} />
      </div>
    </main>
  );
}
