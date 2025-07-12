'use client';

import { MDXProvider } from '@mdx-js/react';
import { useEffect, useState } from 'react';
import { mdxComponents } from '../../lib/components/mdx';

type Props = {
  slug: string;
};

export default function ClientRenderer({ slug }: Props) {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    // Dynamically load the MDX file as a client component
    const load = async () => {
      const mod = await import(`@content/${slug}.mdx`);
      setComponent(() => mod.default);
    };
    load();
  }, [slug]);

  if (!Component) return null;

  return (
    <MDXProvider components={mdxComponents}>
      <Component />
    </MDXProvider>
  );
}
