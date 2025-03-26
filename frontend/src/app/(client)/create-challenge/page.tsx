'use client';

import { useState } from 'react';

import ChatInterface from '@/components/create-challenge/chat-interface';
import QuestionPreview from '@/components/create-challenge/question-preview';

export default function Home() {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [question, setQuestion] = useState({
    title: 'Untitled Question',
    description: 'Add a description for your coding interview question.',
    requirements: ['List your requirements here'],
    sampleInteractions: [
      { title: 'Initial State', steps: ['Describe the initial state'] },
      { title: 'User Action 1', steps: ['Describe user action 1'] },
    ],
  });

  const handleSendMessage = async (message: string) => {
    // Add user message to chat
    const updatedMessages = [...messages, { role: 'user' as const, content: message }];
    setMessages(updatedMessages);

    // Simulate AI response and question update
    setTimeout(() => {
      // Parse the message to update the question
      const updatedQuestion = { ...question };

      if (message.toLowerCase().includes('title')) {
        const titleMatch = message.match(/title[:\s]+([^\n.]+)/i);
        if (titleMatch && titleMatch[1]) {
          updatedQuestion.title = titleMatch[1].trim();
        }
      }

      if (message.toLowerCase().includes('description')) {
        const descMatch = message.match(/description[:\s]+([^\n.]+)/i);
        if (descMatch && descMatch[1]) {
          updatedQuestion.description = descMatch[1].trim();
        }
      }

      if (message.toLowerCase().includes('requirement')) {
        const reqMatch = message.match(/requirement[:\s]+([^\n.]+)/i);
        if (reqMatch && reqMatch[1]) {
          updatedQuestion.requirements = [...updatedQuestion.requirements, reqMatch[1].trim()];
        }
      }

      if (
        message.toLowerCase().includes('interaction') ||
        message.toLowerCase().includes('action')
      ) {
        const actionMatch = message.match(/action[:\s]+([^\n.]+)/i);
        if (actionMatch && actionMatch[1]) {
          updatedQuestion.sampleInteractions.push({
            title: `User Action ${updatedQuestion.sampleInteractions.length}`,
            steps: [actionMatch[1].trim()],
          });
        }
      }

      // Update the question
      setQuestion(updatedQuestion);

      // Add AI response
      setMessages([
        ...updatedMessages,
        {
          role: 'assistant',
          content: `I've updated the ${
            message.toLowerCase().includes('title')
              ? 'title'
              : message.toLowerCase().includes('description')
                ? 'description'
                : message.toLowerCase().includes('requirement')
                  ? 'requirements'
                  : message.toLowerCase().includes('interaction') ||
                      message.toLowerCase().includes('action')
                    ? 'sample interactions'
                    : 'question'
          } based on your input. Is there anything else you'd like to modify?`,
        },
      ]);
    }, 1000);
  };

  //   const resetQuestion = () => {
  //     setQuestion({
  //       title: 'Untitled Question',
  //       description: 'Add a description for your coding interview question.',
  //       requirements: ['List your requirements here'],
  //       sampleInteractions: [
  //         { title: 'Initial State', steps: ['Describe the initial state'] },
  //         { title: 'User Action 1', steps: ['Describe user action 1'] },
  //       ],
  //     });
  //     setMessages([]);
  //   };

  return (
    <main className="flex h-screen bg-slate-50">
      <div className="flex h-full w-1/4 flex-col overflow-hidden border-r border-gray-200 bg-white">
        <div className="border-b border-gray-200 bg-white p-4">
          <h2 className="text-xl font-semibold">Interview Question Generator</h2>
          <p className="text-sm text-gray-500">
            Chat to create and modify your coding interview question
          </p>
        </div>
        <ChatInterface messages={messages} onSendMessage={handleSendMessage} />
      </div>
      <div className="h-full w-3/4 overflow-auto bg-white">
        <div className="border-b border-gray-200 bg-white p-4">
          <h2 className="text-xl font-semibold">Question Preview</h2>
        </div>
        <QuestionPreview question={question} />
      </div>
    </main>
  );
}
