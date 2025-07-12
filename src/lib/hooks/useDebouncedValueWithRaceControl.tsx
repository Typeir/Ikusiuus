import { useEffect, useRef, useState } from 'react';

/**
 * Debounces a value and ensures that only the most recent async response is accepted.
 *
 * @template T - Input value type
 * @template R - Response type
 * @param {T} value - The input to debounce
 * @param {(input: T) => Promise<R>} asyncCallback - The async function to invoke
 * @param {number} delay - Debounce delay in ms
 * @returns {{
 *   result: R | undefined;
 *   loading: boolean;
 * }}
 */
export const useDebouncedValueWithRaceControl = <T, R>(
  value: T,
  asyncCallback: (input: T) => Promise<R>,
  delay = 400
): { result: R | undefined; loading: boolean } => {
  const [result, setResult] = useState<R | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const requestId = useRef(0);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      if (value === undefined || value === null) return;

      const currentRequest = ++requestId.current;
      setLoading(true);

      asyncCallback(value)
        .then((res) => {
          if (currentRequest === requestId.current) {
            setResult(res);
          }
        })
        .catch((err) => {
          if (currentRequest === requestId.current) {
            console.error(
              'Async error in useDebouncedValueWithRaceControl:',
              err
            );
            setResult(undefined);
          }
        })
        .finally(() => {
          if (currentRequest === requestId.current) {
            setLoading(false);
          }
        });
    }, delay);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [value, delay, asyncCallback]);

  return { result, loading };
};
