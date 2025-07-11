// layout.tsx
import fs from 'fs';
import { cookies } from 'next/headers';
import path from 'path';
import { Theme } from '../lib/enums/themes';
import './globals.scss';
import ResponsiveLayoutShell from './utils/responsiveLayoutShell';

const IGNORED_FOLDERS = new Set([
  '.obsidian',
  '.git',
  'node_modules',
  '.vscode',
]);

const toKebabCase = (str: string) =>
  str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .replace(/_/g, '-')
    .toLowerCase();

const walk = (
  dir: string,
  base = ''
): { name: string; path: string; children?: any[] }[] =>
  fs
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
        {/* @ts-ignore */}
        <ResponsiveLayoutShell theme={theme} tree={tree}>
          {children}
        </ResponsiveLayoutShell>
      </body>
    </html>
  );
}
