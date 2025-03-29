'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { useChat } from '@/hooks/use-chat';

import ChatInterface from '@/components/create-challenge/chat-interface';
import QuestionPreview from '@/components/create-challenge/question-preview';

import { Message } from '@/lib/messages';
import { Question } from '@/lib/question';

export default function Home() {
  const [question, setQuestion] = useState<Question>({
    id: 'temp-id',
    problem: {
      id: 'temp-id',
      title: 'Untitled Question',
      description: 'Add a description for your coding interview question.',
      requirements: ['List your requirements here'],
    },
    files: null,
    test_cases: null,
  });

  const [updatedQuestion, setUpdatedQuestion] = useState<Question>(question);

  const previewContainerRef = useRef<HTMLDivElement>(null);

  const handleResponse = useCallback((message: Message) => {
    console.log(message);
  }, []);

  const handleQuestionUpdate = useCallback((update: Question) => {
    const scrollPosition = previewContainerRef.current?.scrollTop || 0;

    setUpdatedQuestion((prevQuestion) => {
      const updated: Question = {
        id: prevQuestion.id,
        problem: prevQuestion.problem
          ? {
              id: prevQuestion.problem.id,
              title: prevQuestion.problem.title,
              description: prevQuestion.problem.description,
              requirements: prevQuestion.problem.requirements,
            }
          : null,
        files: prevQuestion.files,
        test_cases: prevQuestion.test_cases,
      };

      if (update.problem && prevQuestion.problem) {
        updated.problem = {
          id: prevQuestion.problem.id,
          title: update.problem.title ?? prevQuestion.problem.title,
          description: update.problem.description ?? prevQuestion.problem.description,
          requirements: update.problem.requirements ?? prevQuestion.problem.requirements,
        };
      }

      if (update.test_cases) {
        updated.test_cases = update.test_cases;
      }

      if (update.files) {
        updated.files = update.files;
      }

      return updated;
    });

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

  useEffect(() => {
    setQuestion(updatedQuestion);
  }, [updatedQuestion]);

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
        <QuestionPreview question={question} />
      </div>
    </main>
  );
}
