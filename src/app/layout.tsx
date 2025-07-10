// src/app/layout.tsx

import fs from 'fs';
import dynamic from 'next/dynamic';
import { cookies } from 'next/headers';
import Link from 'next/link';
import path from 'path';
import { Sidebar } from '../lib/components/sidebar/sidebar';
import { Theme } from '../lib/enums/themes';
import './globals.scss';
import { ThemeSelectorLayout } from './utils/themeSelectorLayout';

const ThemeSelector = dynamic(
  () =>
    import('../lib/components/themeSelector/themeSelector').then(
      (mod) => mod.ThemeSelector
    ),
  {
    loading: () => (
      <div className='h-10 w-full bg-zinc-800 animate-pulse rounded' />
    ),
  }
);

const IGNORED_FOLDERS = new Set([
  '.obsidian',
  '.git',
  'node_modules',
  '.vscode',
]);

/**
 * Converts a string to kebab-case.
 * @param str string
 * @returns kebab-case string
 */
const toKebabCase = (str: string) => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .replace(/_/g, '-')
    .toLowerCase();
};

/**
 * Recursively walk the content folder to build a tree of markdown paths.
 * @param dir string
 * @param base string
 * @returns array of path objects
 */
const walk = (
  dir: string,
  base = ''
): { name: string; path: string; children?: any[] }[] => {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .map((entry) => {
      if (IGNORED_FOLDERS.has(entry.name)) return null;

      const fullPath = path.join(dir, entry.name);
      const fileName = entry.name.replace(/\.md$/, '');

      const kebabPath = path.join(base, toKebabCase(fileName));

      const prettyFileName = fileName.replace(/\.sheet$/, '');

      if (entry.isDirectory()) {
        return {
          name: prettyFileName,
          path: kebabPath,
          children: walk(fullPath, kebabPath),
        };
      }

      if (entry.name.endsWith('.md')) {
        return {
          name: prettyFileName,
          path: kebabPath,
        };
      }

      return null;
    })
    .filter(Boolean) as any[];
};

const contentDir = path.join(process.cwd(), 'content');
const tree = walk(contentDir);

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = (await cookies()).get('theme')?.value || Theme.Dark;

  return (
    <html lang='en'>
      {/* @ts-ignore */}
      <body theme={theme}>
        <div className='sidebar-container flex min-h-screen'>
          <aside className='sidebar w-80 p-6 border-r sticky top-0 h-screen overflow-y-auto solid'>
            <div className='flex flex-col gap-4'>
              <Link href='/' className='text-lg font-semibold hover:underline'>
                <div className=' flex flex-row gap-4'>
                  <img
                    src='/logo.png'
                    alt='Library of Ikuisuus'
                    className='logo'
                  />
                  <h1 className='text-xl'>
                    <span className='text-sm'>The</span>
                    <br />
                    Library of Ikuisuus
                  </h1>
                </div>
              </Link>
              <ThemeSelectorLayout defaultTheme={theme as Theme} />
              <Sidebar items={tree} />
            </div>
          </aside>
          <main className='flex-1 p-10 solid'>{children}</main>
        </div>
      </body>
    </html>
  );
}
