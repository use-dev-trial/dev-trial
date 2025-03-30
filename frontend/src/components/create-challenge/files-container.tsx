'use client';

import { useState } from 'react';

import Editor from '@monaco-editor/react';
import { ChevronRight, FileCode, FileJson, FileText, FileType } from 'lucide-react';

interface FileProps {
  name: string;
  code: string;
  path?: string[];
}

interface FileContainerProps {
  files: FileProps[];
}

export default function FileContainer({ files }: FileContainerProps) {
  const [activeFile, setActiveFile] = useState<string>(files.length > 0 ? files[0].name : '');

  const getFileExtension = (filename: string) => {
    return filename.split('.').pop() || '';
  };

  const getFileIcon = (filename: string) => {
    const ext = getFileExtension(filename);
    switch (ext) {
      case 'py':
        return <FileCode className="h-4 w-4 text-blue-600" />;
      case 'js':
      case 'jsx':
      case 'ts':
      case 'tsx':
        return <FileCode className="h-4 w-4 text-yellow-600" />;
      case 'json':
        return <FileJson className="h-4 w-4 text-gray-600" />;
      case 'md':
        return <FileText className="h-4 w-4 text-gray-600" />;
      default:
        return <FileType className="h-4 w-4 text-gray-600" />;
    }
  };

  const currentFile = files.find((file) => file.name === activeFile);
  const filePath = currentFile?.path || ['challenge', 'src'];

  return (
    <div className="overflow-hidden rounded-lg border">
      {/* File tabs */}
      <div className="flex border-b bg-gray-50">
        {files.map((file) => (
          <div
            key={file.name}
            className={`flex cursor-pointer items-center border-r px-4 py-2 ${
              activeFile === file.name ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'
            }`}
            onClick={() => setActiveFile(file.name)}
          >
            <span className="mr-2">{getFileIcon(file.name)}</span>
            <span>{file.name}</span>
            {activeFile === file.name && (
              <button
                className="ml-2 text-gray-500 hover:text-gray-700"
                onClick={(e) => {
                  e.stopPropagation();
                  const nextFile = files.find((f) => f.name !== activeFile);
                  if (nextFile) {
                    setActiveFile(nextFile.name);
                  }
                }}
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Breadcrumb navigation */}
      <div className="flex items-center border-b bg-gray-50 px-4 py-2 text-sm text-gray-600">
        {filePath.map((segment, index) => (
          <div key={index} className="flex items-center">
            {index > 0 && <ChevronRight className="mx-1 h-4 w-4" />}
            <span>{segment}</span>
          </div>
        ))}
        {currentFile && (
          <>
            <ChevronRight className="mx-1 h-4 w-4" />
            <span className="font-medium">{currentFile.name}</span>
          </>
        )}
      </div>

      {/* Code editor */}
      {currentFile && (
        <div className="flex">
          <Editor height="90vh" defaultLanguage="python" defaultValue={currentFile.code} />
        </div>
      )}
    </div>
  );
}
