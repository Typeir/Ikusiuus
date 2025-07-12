import fs from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';
import { RegexPatterns } from '../../../lib/enums/constants';
import { getContentFolder } from '../../../lib/utils/getContentFolder';

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

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.toLowerCase() || '';
  const matches: { name: string; path: string }[] = [];

  if (q.length < 2) return NextResponse.json([]);

  const contentDir = getContentFolder();

  function walk(dir: string, base = '') {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (IGNORED_FOLDERS.has(entry.name)) continue;

      const fullPath = path.join(dir, entry.name);
      const fileName = entry.name.replace(/\.(md|mdx)$/, '');

      const kebabPath = path.join(base, toKebabCase(fileName));

      if (entry.isDirectory()) {
        walk(fullPath, kebabPath);
      } else if (
        (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) &&
        fileName.toLowerCase().includes(q)
      ) {
        matches.push({
          name: fileName
            .replace(/\.sheet\.(md|mdx)$/, '')
            .replace(RegexPatterns.SheetSuffix, ''),
          path: kebabPath,
        });
      }
    }
  }

  walk(contentDir);

  return NextResponse.json(matches);
}
