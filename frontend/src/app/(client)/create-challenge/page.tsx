'use client';

import { useCallback, useState } from 'react';

import { useChat } from '@/hooks/use-chat';

import ChatInterface from '@/components/create-challenge/chat-interface';
import QuestionPreview from '@/components/create-challenge/question-preview';

import { Message } from '@/lib/messages';

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

  // Handle AI responses to update the question
  const handleResponse = useCallback((message: Message) => {
    // Here you would implement logic to parse the AI response
    // and update the question state accordingly
    // This is a simplistic example - you'd want more sophisticated parsing
    // const content = message.content;
    setQuestion((prevQuestion) => ({
      ...prevQuestion,
      // Update properties based on message content
    }));
    console.log(message);
  }, []);

  const { messages, sendMessage, isLoading } = useChat({
    onResponse: handleResponse,
  });

  return (
    <main className="flex h-screen bg-slate-50">
      <div className="flex h-full w-3/10 flex-col overflow-hidden border-r border-gray-200 bg-white">
        <div className="border-b border-gray-200 bg-white p-4">
          <h2 className="text-xl font-semibold">Interview Question Generator</h2>
          <p className="text-sm text-gray-500">
            Chat to create and modify your coding interview question
          </p>
        </div>
        <ChatInterface messages={messages} onSendMessage={sendMessage} />
      </div>
      <div className="h-full w-7/10 overflow-auto bg-white">
        <div className="border-b border-gray-200 bg-white p-4">
          <h2 className="text-xl font-semibold">Question Preview</h2>
          {isLoading && <p className="text-sm text-gray-500">Updating question...</p>}
        </div>
        <QuestionPreview question={question} />
      </div>
    </main>
  );
}
