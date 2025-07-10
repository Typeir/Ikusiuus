'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type SearchResult = { name: string; path: string };

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data: SearchResult[] = await res.json();
        setResults(data);
      } catch (err) {
        console.error('Search error:', err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className='space-y-6'>
      <input
        type='text'
        placeholder='Search the Library...'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className='w-full p-3rounded'
      />

      {loading && <p className='text-sm'>Searching...</p>}

      {results.length > 0 && (
        <div className='max-h-96 overflow-y-auto borderrounded p-4'>
          <h3 className='text-sm font-semibold mb-2'>Local Results</h3>
          <ul className='space-y-1 text-sm'>
            {results.map((r) => (
              <li key={r.path}>
                <Link
                  href={`/library/${r.path}`}
                  className='text-blue-300 hover:underline'>
                  {r.name}
                </Link>
              </li>
            ))}
          </ul>
          <h3 className='text-sm font-semibold mb-2'>
            Results from beyond the Clone Worlds
          </h3>
        </div>
      )}
    </div>
  );
}
