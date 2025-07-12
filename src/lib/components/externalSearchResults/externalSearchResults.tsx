import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

/**
 * Represents a single Google search result item.
 */
type GoogleSearchResult = {
  title: string;
  link: string;
};

/**
 * Renders external search results from the Google CSE API.
 * Styled identically to the local results list in `page.tsx`.
 *
 * @param {string} query - The search term
 * @returns {JSX.Element}
 */
export const ExternalSearchResults = ({ query }: { query: string }) => {
  const [extResults, setExtResults] = useState<GoogleSearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  /** Tracks latest request ID to prevent race-condition overwrites. */
  const requestIdRef = useRef<number>(0);

  useEffect(() => {
    const currentRequestId = ++requestIdRef.current;

    if (query.length < 2) return;

    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/web-search?q=${encodeURIComponent(query)}`
        );

        const data = await res.json();
        const results: GoogleSearchResult[] = Array.isArray(data)
          ? data
          : data.items || [];

        // Only accept non-empty results if this is the latest request
        if (requestIdRef.current === currentRequestId && results.length > 0) {
          setExtResults(results);
        }
      } catch (err) {
        if (requestIdRef.current === currentRequestId) {
          console.error('External search failed', err);
        }
      } finally {
        if (requestIdRef.current === currentRequestId) {
          setLoading(false);
        }
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  const LoadingText = () => (
    <p className='text-sm seconadry mt-2 italic'>Peering beyond the folds...</p>
  );

  if (!extResults.length) {
    return loading ? (
      <LoadingText />
    ) : query ? (
      <p className='text-sm seconadry mt-2 italic '>
        Naught but dragons beyond this place
      </p>
    ) : undefined;
  }

  return (
    <>
      {loading ? <LoadingText /> : undefined}
      <ul className='space-y-1 text-sm mt-2'>
        <h3 className='text-sm font-semibold mb-2 mt-2'>
          Results from beyond the Clone Worlds
        </h3>

        {extResults.map((r) => (
          <li key={r.link}>
            <Link
              href={`/library/beyond?url=${encodeURIComponent(r.link)}`}
              className='hover:underline'>
              {r.title}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};
