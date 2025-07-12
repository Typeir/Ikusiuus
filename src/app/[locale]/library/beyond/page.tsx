'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * Renders an external URL in an iframe or shows a poetic fallback
 * if the domain refuses embedding (like Wikidot).
 *
 * @returns {JSX.Element}
 */
export default function BeyondViewer() {
  const searchParams = useSearchParams();
  const [safeUrl, setSafeUrl] = useState<string | null>(null);
  const [blocked, setBlocked] = useState<boolean>(false);
  const [opened, setOpened] = useState<boolean>(false); // to avoid repeat tab openings

  useEffect(() => {
    const rawUrl = searchParams.get('url');
    try {
      if (!rawUrl) return;
      const parsed = new URL(rawUrl);
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
        setSafeUrl(parsed.toString());

        // Block known iframe-hostile domains
        if (parsed.hostname.endsWith('wikidot.com')) {
          setBlocked(true);
        }
      }
    } catch {
      setSafeUrl(null);
    }
  }, [searchParams]);

  useEffect(() => {
    if (blocked && safeUrl && !opened) {
      window.open(safeUrl, '_blank', 'noopener,noreferrer');
      setOpened(true);
    }
  }, [blocked, safeUrl, opened]);

  if (!safeUrl) {
    return (
      <div className='p-6 text-sm text-zinc-400'>
        Invalid or missing URL. This portal could not be opened.
      </div>
    );
  }

  if (blocked) {
    return (
      <div className='h-screen w-full bg-zinc-900 text-white flex items-center justify-center p-6'>
        <div className='max-w-xl text-center text-zinc-400 italic text-sm'>
          This reality refused the grasp of the Tree of Fate, travelling beyond
          the folds.
        </div>
      </div>
    );
  }

  return (
    <div className='h-screen w-full bg-zinc-900 text-white p-2'>
      <div className='text-xs text-zinc-500 mb-2 truncate'>
        Viewing external archive:
        <span className='ml-1 text-blue-300'>{safeUrl}</span>
      </div>
      <iframe
        src={safeUrl}
        className='w-full h-[calc(100vh-3rem)] border border-zinc-700 rounded'
        sandbox='allow-scripts allow-same-origin allow-forms'
      />
    </div>
  );
}
