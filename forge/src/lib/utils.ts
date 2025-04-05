import { useCallback, useEffect, useRef } from 'react';

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const formatDate = () => {
  const date = new Date();
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// A generic type for any function
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunction = (...args: any[]) => any;

/**
 * Creates a debounced version of a callback function.
 * The debounced function delays invoking the original callback until after `delay`
 * milliseconds have elapsed since the last time the debounced function was invoked.
 *
 * @template T The type of the callback function.
 * @param {T} callback The function to debounce.
 * @param {number} delay The number of milliseconds to delay.
 * @returns A memoized debounced function with the same signature as the original callback, but returning void.
 */
export function useDebouncedCallback<T extends AnyFunction>(
  callback: T,
  delay: number,
): (...args: Parameters<T>) => void {
  // Note: Returns void, doesn't proxy the return value of async calls directly

  const callbackRef = useRef<T>(callback);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Update ref to the latest callback.
  // This is important if the callback function provided changes identity
  // between renders (e.g., due to dependencies), ensuring we always
  // call the *most recent* version.
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Cleanup the timer when the component unmounts or the delay changes.
  useEffect(() => {
    // Return a cleanup function that clears the timer
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [delay]); // Rerun effect only if delay changes (though usually stable)

  // Create the memoized debounced function using useCallback.
  // It depends only on the `delay`, as the callback itself is accessed via ref.
  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      // Clear any existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      // Set a new timer
      timerRef.current = setTimeout(() => {
        // Call the latest version of the callback with the provided arguments
        callbackRef.current(...args);
      }, delay);
    },
    [delay], // Dependency array: only recreate if delay changes
  );

  return debouncedCallback;
}
