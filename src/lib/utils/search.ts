import fs from 'fs';
import path from 'path';

const IGNORED_FOLDERS = new Set(['.obsidian', '.git', 'node_modules', '.vscode']);

function toKebabCase(str: string) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .replace(/_/g, '-')
    .toLowerCase();
}

export async function searchContent(query: string) {
  const contentDir = path.join(process.cwd(), 'content');
  const matches: { name: string; path: string }[] = [];

  function walk(dir: string, base = '') {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (IGNORED_FOLDERS.has(entry.name)) continue;

      const fullPath = path.join(dir, entry.name);
      const fileName = entry.name.replace(/\.md$/, '');
      const kebabPath = path.join(base, toKebabCase(fileName));

      if (entry.isDirectory()) {
        walk(fullPath, kebabPath);
      } else if (entry.name.endsWith('.md') && fileName.toLowerCase().includes(query.toLowerCase())) {
        matches.push({ name: fileName, path: kebabPath });
      }
    }
  }

  walk(contentDir);
  return matches;
}
