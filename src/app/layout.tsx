// src/app/layout.tsx

import fs from 'fs';
import path from 'path';
import { Sidebar } from '../lib/components/sidebar/sidebar';
import { ThemeSelector } from '../lib/components/themeSelector/themeSelector';
import './globals.css';

const IGNORED_FOLDERS = new Set([
  '.obsidian',
  '.git',
  'node_modules',
  '.vscode',
]);

function toKebabCase(str: string) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .replace(/_/g, '-')
    .toLowerCase();
}

function walk(
  dir: string,
  base = ''
): { name: string; path: string; children?: any[] }[] {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .map((entry) => {
      if (IGNORED_FOLDERS.has(entry.name)) return null;

      const fullPath = path.join(dir, entry.name);
      const fileName = entry.name.replace(/\.md$/, '');
      const kebabPath = path.join(base, toKebabCase(fileName));

      if (entry.isDirectory()) {
        return {
          name: entry.name,
          path: kebabPath,
          children: walk(fullPath, kebabPath),
        };
      }

      if (entry.name.endsWith('.md')) {
        return {
          name: fileName,
          path: kebabPath,
        };
      }

      return null;
    })
    .filter(Boolean) as any[];
}

const contentDir = path.join(process.cwd(), 'content');
const tree = walk(contentDir);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body>
        <div className='flex min-h-screen bg-zinc-950 text-zinc-100'>
          <aside className='w-64 p-6 border-r border-zinc-800 bg-zinc-900 sticky top-0 h-screen overflow-y-auto'>
            <div className='flex flex-col gap-4'>
              <ThemeSelector />
              <h2 className='text-lg font-semibold'>Library of Ikuisuus</h2>
              <Sidebar items={tree} />
            </div>
          </aside>
          <main className='flex-1 p-10'>{children}</main>
        </div>
      </body>
    </html>
  );
}
