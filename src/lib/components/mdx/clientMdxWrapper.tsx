'use client';

import { MDXProvider } from '@mdx-js/react';
import { mdxComponents } from '.';

export default function ClientMdxWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MDXProvider components={mdxComponents}>{children}</MDXProvider>;
}
