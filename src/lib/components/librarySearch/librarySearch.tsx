'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import { ExternalSearchResults } from '../externalSearchResults/externalSearchResults';
import styles from './librarySearch.module.scss';

/**
 * Represents a single local search result item returned by the internal API.
 */
type SearchResult = {
  /** Display name of the result */
  name: string;
  /** Internal library route */
  path: string;
};

/**
 * Search component for the Ikuisuus project.
 *
 * This component provides both local and external search capabilities:
 * - Local results come from the internal `/api/search` endpoint.
 * - External results (optional) are sourced via Google CSE (Wikidot).
 *
 * Includes debounce input handling, race condition safety, and lore-style fallback messaging.
 *
 * @returns {JSX.Element} The full search UI
 */
export const LibrarySearch = (): JSX.Element => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 400);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showLoadingText, setShowLoadingText] = useState(false);
  const [searchBeyond, setSearchBeyond] = useState(false);

  /**
   * Tracks the most recent request for local search to avoid race conditions.
   * Only the result from the latest fetch is allowed to update UI state.
   */
  const requestIdRef = useRef(0);

  /**
   * Runs a debounced local search using the internal API.
   * Replaces results only if data is present, ensuring graceful fallback.
   */
  useEffect(() => {
    const currentRequestId = ++requestIdRef.current;

    if (debouncedQuery.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    const search = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(debouncedQuery)}`
        );
        const data: SearchResult[] = await res.json();

        // Only update results if this is the latest fetch and data is non-empty
        if (
          requestIdRef.current === currentRequestId &&
          Array.isArray(data) &&
          data.length > 0
        ) {
          setResults(data);
        }
      } catch (err) {
        if (requestIdRef.current === currentRequestId) {
          console.error('Search error:', err);
        }
      } finally {
        if (requestIdRef.current === currentRequestId) {
          setLoading(false);
        }
      }
    };

    search();
  }, [debouncedQuery]);

  /**
   * Controls whether the "Searching..." indicator is visible.
   * Adds a 150ms delay before showing, to prevent flickering on fast queries.
   */
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (loading) {
      timeout = setTimeout(() => setShowLoadingText(true), 150);
    } else {
      setShowLoadingText(false);
    }
    return () => clearTimeout(timeout);
  }, [loading]);

  return (
    <div className={styles.container}>
      <div className={styles.inputWrapper}>
        <input
          type='text'
          placeholder='Search the Library...'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={styles.searchInput}
          aria-label='Search the Library'
        />
        <div
          className={`${styles.searching} ${
            showLoadingText ? styles.visible : ''
          }`}>
          Searching...
        </div>
      </div>

      <label className='inline-flex items-center space-x-2 text-sm'>
        <input
          type='checkbox'
          checked={searchBeyond}
          onChange={(e) => setSearchBeyond(e.target.checked)}
        />
        <span>Search beyond the Clone Worlds</span>
      </label>

      <div className='max-h-96 overflow-y-auto border border-zinc-700 rounded p-4'>
        {results.length > 0 && (
          <>
            <h3 className='text-sm font-semibold mb-2'>Local Results</h3>
            <ul className='space-y-1 text-sm'>
              {results.map((r) => (
                <li key={r.path}>
                  <Link href={`/library/${r.path}`} className='hover:underline'>
                    {r.name}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}

        {/* Search message */}
        {loading && (
          <p className='italic text-sm secondary'>Searching the archives</p>
        )}

        {/* Lore fallback for empty local search */}
        {debouncedQuery.length >= 2 && results.length === 0 && !loading && (
          <p className='italic text-sm secondary'>
            This subject has been redacted.{' '}
            {!searchBeyond && 'The Clone Worlds may hold the answers'}
          </p>
        )}

        {/* Waiting message for short input */}
        {debouncedQuery.length < 2 && (
          <p className='italic text-sm secondary'>Waiting for input</p>
        )}

        {/* External search toggle logic */}
        {searchBeyond ? (
          <ExternalSearchResults query={query} />
        ) : (
          <p className='italic text-sm secondary mt-2'>
            Enable the checkbox above to access off-world sources.
          </p>
        )}
      </div>
    </div>
  );
};
