'use client';

import { useParams } from 'next/navigation';

import { useEffect, useRef, useState } from 'react';

// import { getChallenge } from '@/actions/challenges';

import { CodeSection } from '@/components/challenges/candidate-view/code-section';
import { Footer } from '@/components/challenges/candidate-view/footer';
import { TopBar } from '@/components/challenges/candidate-view/header';
import { QuestionSection } from '@/components/challenges/candidate-view/question-section';
import { TestSection } from '@/components/challenges/candidate-view/test-section';

// import { GetChallengeResponse } from '@/types/challenges';

import { cn, formatTime } from '@/lib/utils';

export default function ChallengeInterface() {
  const params = useParams();
  const [leftPanelWidth, setLeftPanelWidth] = useState(40);
  const [bottomPanelHeight, setBottomPanelHeight] = useState(30);
  const [isHorizontalDragging, setIsHorizontalDragging] = useState(false);
  const [isVerticalDragging, setIsVerticalDragging] = useState(false);
  const [remainingTime, setRemainingTime] = useState(3600); // TODO: replace with challenge duration
  const containerRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  // const [challenge, setChallenge] = useState<GetChallengeResponse | null>(null);

  useEffect(() => {
    const fetchChallenge = async () => {
      // const challenge = await getChallenge(params.id as string);
      // setChallenge(challenge);
    };
    fetchChallenge();
  }, [params.id]);

  // Handle countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle horizontal mouse events for resizing
  const handleHorizontalMouseDown = () => {
    setIsHorizontalDragging(true);
  };

  // Handle vertical mouse events for resizing
  const handleVerticalMouseDown = () => {
    setIsVerticalDragging(true);
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

  return (
    <div
      className={cn(
        'flex h-screen flex-col',
        (isHorizontalDragging || isVerticalDragging) && 'select-none',
      )}
    >
      <TopBar remainingTime={remainingTime} formatTime={formatTime} />
      <div ref={containerRef} className="relative flex flex-1 overflow-hidden">
        {/* Left Panel */}
        <QuestionSection width={leftPanelWidth} />
        {/* Horizontal Resizer */}
        <div
          className={cn(
            'absolute top-0 bottom-0 z-10 w-1 cursor-col-resize bg-gray-300 transition-colors hover:bg-blue-500/50 active:bg-blue-500/70 dark:bg-gray-700',
            isHorizontalDragging && 'bg-blue-500',
          )}
          style={{ left: `${leftPanelWidth}%` }}
          onMouseDown={handleHorizontalMouseDown}
        />
        {/* Right Panel */}
        <div
          ref={rightPanelRef}
          className="flex flex-col overflow-hidden"
          style={{ width: `${100 - leftPanelWidth}%`, height: '100%' }}
        >
          <CodeSection
            width={100}
            bottomPanelHeight={bottomPanelHeight}
            isVerticalDragging={isVerticalDragging}
            handleVerticalMouseDown={handleVerticalMouseDown}
          />
          <TestSection height={bottomPanelHeight} isVerticalDragging={isVerticalDragging} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
