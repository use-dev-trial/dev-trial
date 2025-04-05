'use client';

import { useTheme } from 'next-themes';

import { useState } from 'react';

import Editor from '@monaco-editor/react';
import { ChevronRight, FileText, X } from 'lucide-react';

import { cn } from '@/lib/utils';

interface CodeSectionProps {
  width: number;
  bottomPanelHeight: number;
  isVerticalDragging: boolean;
  handleVerticalMouseDown: () => void;
}

export function CodeSection({
  width,
  bottomPanelHeight,
  isVerticalDragging,
  handleVerticalMouseDown,
}: CodeSectionProps) {
  const [activeTab, setActiveTab] = useState('CodeReviewFeedback.js');
  const { theme } = useTheme();

  const codeContent = {
    'CodeReviewFeedback.js': `import React from "react";

const FeedbackSystem = () => {
  return (
    <div className="my-0 mx-auto text-center w-mx-1200">
      <div className="flex wrap justify-content-center mt-30 gap-30">
        <div className="pa-10 w-300 card">
          <h2>Readability</h2>
          <div className="flex my-30 mx-0 justify-content-around">
            <button className="py-10 px-15" data-testid="upvote-btn-0">
              👍 Upvote
            </button>
            <button className="py-10 px-15 danger" data-testid="downvote-btn-0">
              👎 Downvote
            </button>
          </div>
          <p className="my-10 mx-0" data-testid="upvote-count-0">
            Upvotes: <strong>{0}</strong>
          </p>
          <p className="my-10 mx-0" data-testid="downvote-count-0">
            Downvotes: <strong>{0}</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeedbackSystem;`,
    'App.js': `import React from 'react';
import FeedbackSystem from './CodeReviewFeedback';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Code Review Feedback</h1>
      </header>
      <main>
        <FeedbackSystem />
      </main>
    </div>
  );
}

export default App;`,
  };

  const getFileExtension = (filename: string) => {
    return filename.split('.').pop() || '';
  };

  const getLanguage = (filename: string) => {
    const ext = getFileExtension(filename);
    switch (ext) {
      case 'py':
        return 'python';
      case 'js':
        return 'javascript';
      case 'jsx':
        return 'javascript';
      case 'ts':
        return 'typescript';
      case 'tsx':
        return 'typescript';
      case 'json':
        return 'json';
      case 'md':
        return 'markdown';
      default:
        return 'javascript';
    }
  };

  return (
    <div
      className={cn('flex h-full flex-col overflow-hidden', isVerticalDragging && 'select-none')}
      style={{ width: `${width}%` }}
    >
      {/* File Tabs */}
      <div className="flex border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-800">
        <div className="flex overflow-x-auto">
          {Object.keys(codeContent).map((fileName) => (
            <div
              key={fileName}
              className={cn(
                'flex cursor-pointer items-center border-r border-gray-200 px-3 py-2 dark:border-gray-800',
                activeTab === fileName
                  ? 'bg-white dark:bg-gray-900'
                  : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700',
              )}
              onClick={() => setActiveTab(fileName)}
            >
              <FileText className="mr-2 h-4 w-4 text-yellow-500" />
              <span className="text-sm dark:text-gray-300">{fileName}</span>
              {activeTab === fileName && (
                <X className="ml-2 h-4 w-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* File Path */}
      <div className="flex items-center border-b border-gray-200 bg-gray-50 px-4 py-1 text-xs text-gray-500 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-400">
        <span>challenge</span>
        <ChevronRight className="mx-1 h-3 w-3" />
        <span>src</span>
        <ChevronRight className="mx-1 h-3 w-3" />
        <span>components</span>
        <ChevronRight className="mx-1 h-3 w-3" />
        <FileText className="mr-1 h-3 w-3 text-yellow-500" />
        <span>{activeTab}</span>
      </div>

      {/* Code Editor - Now using Monaco Editor */}
      <div
        className="flex-1 bg-white dark:bg-gray-900"
        style={{ height: `${100 - bottomPanelHeight}%` }}
      >
        <Editor
          height="100%"
          language={getLanguage(activeTab)}
          value={codeContent[activeTab as keyof typeof codeContent]}
          theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
          }}
        />
      </div>

      {/* Vertical Resizer */}
      <div
        className={cn(
          'relative z-10 h-1 cursor-row-resize bg-gray-300 transition-colors hover:bg-blue-500/50 active:bg-blue-500/70 dark:bg-gray-700',
          isVerticalDragging && 'bg-blue-500',
        )}
        onMouseDown={handleVerticalMouseDown}
      />
    </div>
  );
}
