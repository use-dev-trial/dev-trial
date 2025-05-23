'use client';

import { useTheme } from 'next-themes';

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

import Editor, { OnMount } from '@monaco-editor/react';
import { ChevronRight, FileText, X } from 'lucide-react';
import * as monaco from 'monaco-editor';

import { File } from '@/types/files';

import { cn } from '@/lib/utils';

interface CodeSectionProps {
  width: number;
  bottomPanelHeight: number;
  isVerticalDragging: boolean;
  handleVerticalMouseDown: () => void;
  files?: File[];
}

export interface CodeSectionHandle {
  getCode: () => string;
}

// Adding displayName to the component
export const CodeSection = forwardRef<CodeSectionHandle, CodeSectionProps>(
  ({ width, bottomPanelHeight, isVerticalDragging, handleVerticalMouseDown, files }, ref) => {
    const [activeTab, setActiveTab] = useState('');
    const { theme } = useTheme();
    const [codeContent, setCodeContent] = useState<Record<string, string>>({});
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

    // Expose methods to parent components
    useImperativeHandle(ref, () => ({
      getCode: () => {
        return codeContent[activeTab] || '';
      },
    }));

    // Initialize code content and active tab based on provided files
    useEffect(() => {
      if (files && files.length > 0) {
        const fileContentMap: Record<string, string> = {};
        files.forEach((file) => {
          fileContentMap[file.name] = file.code;
        });
        setCodeContent(fileContentMap);
        setActiveTab(files[0].name);
      } else {
        // Set empty state when no files are provided
        setCodeContent({});
        setActiveTab('');
      }
    }, [files]);

    // Handle editor mount
    const handleEditorDidMount: OnMount = (editor) => {
      editorRef.current = editor;
    };

    // Handle code changes
    const handleEditorChange = (value: string | undefined) => {
      if (value !== undefined && activeTab) {
        setCodeContent((prev) => ({
          ...prev,
          [activeTab]: value,
        }));
      }
    };

    // If no files are provided, show a placeholder
    if (Object.keys(codeContent).length === 0) {
      return (
        <div
          className={cn(
            'flex h-full flex-col overflow-hidden',
            isVerticalDragging && 'select-none',
          )}
          style={{ width: `${width}%` }}
        >
          <div className="border-border bg-muted flex border-b px-4 py-2">
            <span className="text-foreground text-sm">No files available</span>
          </div>
          <div
            className="bg-background flex flex-1 items-center justify-center"
            style={{ height: `${100 - bottomPanelHeight}%` }}
          >
            <p className="text-muted-foreground">No code files are available for this question</p>
          </div>

          {/* Vertical Resizer */}
          <div
            className={cn(
              'bg-border hover:bg-primary/50 active:bg-primary/70 relative z-10 h-1 cursor-row-resize transition-colors',
              isVerticalDragging && 'bg-primary',
            )}
            onMouseDown={handleVerticalMouseDown}
          />
        </div>
      );
    }

    return (
      <div
        className={cn('flex h-full flex-col overflow-hidden', isVerticalDragging && 'select-none')}
        style={{ width: `${width}%` }}
      >
        {/* File Tabs */}
        <div className="border-border bg-muted flex border-b">
          <div className="flex overflow-x-auto">
            {Object.keys(codeContent).map((fileName) => (
              <div
                key={fileName}
                className={cn(
                  'border-border flex cursor-pointer items-center border-r px-3 py-2',
                  activeTab === fileName ? 'bg-background' : 'bg-muted hover:bg-muted/80',
                )}
                onClick={() => setActiveTab(fileName)}
              >
                <FileText className="mr-2 h-4 w-4 text-yellow-500" />
                <span className="text-foreground text-sm">{fileName}</span>
                {activeTab === fileName && (
                  <X className="text-muted-foreground hover:text-foreground ml-2 h-4 w-4" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* File Path */}
        <div className="border-border bg-muted text-muted-foreground flex items-center border-b px-4 py-1 text-xs">
          <span>challenge</span>
          <ChevronRight className="mx-1 h-3 w-3" />
          <FileText className="mr-1 h-3 w-3 text-yellow-500" />
          <span>{activeTab}</span>
        </div>

        {/* Code Editor - Now using Monaco Editor */}
        <div className="bg-background flex-1" style={{ height: `${100 - bottomPanelHeight}%` }}>
          <Editor
            height="100%"
            language="python"
            value={codeContent[activeTab]}
            theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
            }}
          />
        </div>

        {/* Vertical Resizer */}
        <div
          className={cn(
            'bg-border hover:bg-primary/50 active:bg-primary/70 relative z-10 h-1 cursor-row-resize transition-colors',
            isVerticalDragging && 'bg-primary',
          )}
          onMouseDown={handleVerticalMouseDown}
        />
      </div>
    );
  },
);

CodeSection.displayName = 'CodeSection';
