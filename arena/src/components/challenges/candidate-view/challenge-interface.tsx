'use client';

import { useEffect, useRef, useState } from 'react';

import { useQuestion } from '@/hooks/use-question';

import {
  CodeSection,
  CodeSectionHandle,
} from '@/components/challenges/candidate-view/code-section';
import { TopBar } from '@/components/challenges/candidate-view/header';
import { QuestionSection } from '@/components/challenges/candidate-view/question-section';
import { TestSection } from '@/components/challenges/candidate-view/test-section';

import { cn } from '@/lib/utils';

interface ChallengeInterfaceProps {
  challengeId: string;
  challengeName: string;
}

export function ChallengeInterface({ challengeId, challengeName }: ChallengeInterfaceProps) {
  const { questions, isLoading } = useQuestion({ challengeId });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [leftPanelWidth, setLeftPanelWidth] = useState(40);
  const [bottomPanelHeight, setBottomPanelHeight] = useState(30);
  const [isHorizontalDragging, setIsHorizontalDragging] = useState(false);
  const [isVerticalDragging, setIsVerticalDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const codeSectionRef = useRef<CodeSectionHandle>(null);

  const handleHorizontalMouseDown = () => {
    setIsHorizontalDragging(true);
  };

  const handleVerticalMouseDown = () => {
    setIsVerticalDragging(true);
  };

  // Function to get code from the CodeSection component
  const getCode = () => {
    return codeSectionRef.current?.getCode() || '';
  };

  // Function to handle moving to the next question
  const handleNextQuestion = () => {
    if (questions && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Handle submit if it's the last question
      console.log('Submitting final answer');
      // Add submission logic here
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Handle horizontal resizing
      if (isHorizontalDragging && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const newLeftPanelWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;

        // Limit the minimum and maximum width
        if (newLeftPanelWidth >= 20 && newLeftPanelWidth <= 80) {
          setLeftPanelWidth(newLeftPanelWidth);
        }
      }

      // Handle vertical resizing
      if (isVerticalDragging && rightPanelRef.current) {
        const rightPanelRect = rightPanelRef.current.getBoundingClientRect();
        const rightPanelHeight = rightPanelRect.height;
        const mouseYRelativeToPanel = e.clientY - rightPanelRect.top;

        // Calculate the percentage of the bottom panel
        const newBottomPanelHeight =
          ((rightPanelHeight - mouseYRelativeToPanel) / rightPanelHeight) * 100;

        // Limit the minimum and maximum height
        if (newBottomPanelHeight >= 15 && newBottomPanelHeight <= 70) {
          setBottomPanelHeight(newBottomPanelHeight);
        }
      }
    };

    /*
     * When dragging the seperator, texts from the code section got highlighted.
     * This is a workaround to prevent that from happening.
     */
    const handleMouseUp = () => {
      setIsHorizontalDragging(false);
      setIsVerticalDragging(false);
      // Remove any selection that might have occurred
      window.getSelection()?.removeAllRanges();
    };

    if (isHorizontalDragging || isVerticalDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      // Add a class to the body to prevent text selection
      document.body.classList.add('select-none');
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);

      // Remove the class when dragging ends
      document.body.classList.remove('select-none');
    };
  }, [isHorizontalDragging, isVerticalDragging]);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading questions...</div>;
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        No questions found for this challenge
      </div>
    );
  }

  // Get current question based on the index
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div
      className={cn(
        'bg-background flex h-screen flex-col',
        (isHorizontalDragging || isVerticalDragging) && 'select-none',
      )}
    >
      <TopBar
        questionCount={questions.length}
        currentQuestionIndex={currentQuestionIndex}
        onNextQuestion={handleNextQuestion}
        challengeName={challengeName}
      />
      <div ref={containerRef} className="relative flex flex-1 overflow-hidden">
        <QuestionSection width={leftPanelWidth} question={currentQuestion} />
        <div
          className={cn(
            'bg-border hover:bg-primary/50 active:bg-primary/70 absolute top-0 bottom-0 z-10 w-1 cursor-col-resize transition-colors',
            isHorizontalDragging && 'bg-primary',
          )}
          style={{ left: `${leftPanelWidth}%` }}
          onMouseDown={handleHorizontalMouseDown}
        />
        <div
          ref={rightPanelRef}
          className="flex flex-col overflow-hidden"
          style={{ width: `${100 - leftPanelWidth}%`, height: '100%' }}
        >
          <CodeSection
            ref={codeSectionRef}
            width={100}
            bottomPanelHeight={bottomPanelHeight}
            isVerticalDragging={isVerticalDragging}
            handleVerticalMouseDown={handleVerticalMouseDown}
            files={currentQuestion.files}
          />
          <TestSection
            height={bottomPanelHeight}
            isVerticalDragging={isVerticalDragging}
            testCases={currentQuestion.test_cases}
            questionId={currentQuestion.id}
            getCode={getCode}
          />
        </div>
      </div>
    </div>
  );
}
