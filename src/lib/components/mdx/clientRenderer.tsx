'use client';

import { MDXProvider } from '@mdx-js/react';
import React from 'react';
import * as runtime from 'react/jsx-runtime';
import { mdxComponents } from './index';

type Props = {
  code: string;
};

export default function ClientRenderer({ code }: Props) {
  const exports = {};
  const fn = new Function(
    'exports',
    'require',
    'module',
    'React',
    ...Object.keys(runtime),
    code
  );
  fn(exports, require, { exports }, React, ...Object.values(runtime));

  //@ts-ignore
  const MDXContent = exports.default;

  return (
    <MDXProvider components={mdxComponents}>
      <MDXContent />
    </MDXProvider>
  );
}
