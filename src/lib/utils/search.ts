import fs from 'fs';
import path from 'path';

const IGNORED_FOLDERS = new Set([
  '.obsidian',
  '.git',
  'node_modules',
  '.vscode',
]);

/**
 * Converts a string to kebab-case.
 * Replaces camelCase, spaces, and underscores with hyphens.
 *
 * @param {string} str - The input string.
 * @returns {string} The kebab-case version of the input.
 */
const toKebabCase = (str: string) => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2') // camelCase to kebab-case
    .replace(/\s+/g, '-') // spaces to dashes
    .replace(/_/g, '-') // underscores to dashes
    .toLowerCase(); // normalize casing
};

/**
 * Searches for markdown files in the `content` directory whose names include the given query.
 * The result includes the file name (without extension) and a kebab-case path relative to the `content` root.
 *
 * Skips hidden folders like `.git`, `.vscode`, and known infrastructure directories (`node_modules`, etc).
 *
 * @param {string} query - The search term to look for (case-insensitive).
 * @returns {Promise<Array<{ name: string, path: string }>>} A list of matched markdown files with their relative kebab-case paths.
 */
export const searchContent = async (
  query: string
): Promise<{ name: string; path: string }[]> => {
  const contentDir = path.join(process.cwd(), 'content');

  /**
   * Recursively walks through a directory and its subdirectories to find matching `.md or .mdx` files.
   *
   * @param {string} dir - The absolute path of the directory to scan.
   * @param {string} base - The base relative path built from previous recursion steps.
   * @returns {Array<{ name: string, path: string }>}
   */
  const walk = (dir: string, base = '') => {
    const matches: { name: string; path: string }[] = [];

    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (IGNORED_FOLDERS.has(entry.name)) continue;

      const fullPath = path.join(dir, entry.name);
      const fileName = entry.name.replace(/\.(md|mdx)$/, '');
      const kebabPath = path.join(base, toKebabCase(fileName));

      if (entry.isDirectory()) {
        walk(fullPath, kebabPath); // recurse into subdirectories
      } else if (
        (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) &&
        fileName.toLowerCase().includes(query.toLowerCase())
      ) {
        matches.push({ name: fileName, path: kebabPath });
      }
    }
    return matches;
  };

  return walk(contentDir);
};
