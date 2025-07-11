// layout.tsx
import fs from 'fs';
import { cookies } from 'next/headers';
import path from 'path';
import {
  FILE_EXT_MD,
  FILE_EXT_MDX,
  IGNORED_FOLDERS,
  REGEX_EXTENSION,
  RegexPatterns,
} from '../lib/enums/constants';
import { PersistentData } from '../lib/enums/persistentData';
import { Theme } from '../lib/enums/themes';
import { getContentFolder } from '../lib/utils/getContentFolder';
import { toTitleCase } from '../lib/utils/toTitleCase';
import './globals.scss';
import ResponsiveLayoutShell from './utils/responsiveLayoutShell';

const IGNORED_FOLDERS_SET = new Set<string>(IGNORED_FOLDERS);

/**
 * Converts a string to kebab-case.
 */
const toKebabCase = (str: string): string =>
  str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .replace(/_/g, '-')
    .toLowerCase();

/**
 * Retrieves the base name of a file (portion before the first dot).
 */
const getBaseName = (filename: string): string => filename.split('.')[0];

/**
 * Filters and deduplicates filenames by basename.
 * Keeps the filename with the longer length as higher priority.
 *
 * @param {string[]} files - Sorted array of filenames.
 * @returns {string[]} Deduplicated array of filenames.
 */
const deduplicateFiles = (files: string[]): string[] => {
  const result: string[] = [];

  for (const file of files) {
    if (result.length === 0) {
      result.push(file);
      continue;
    }

    const lastFile = result[result.length - 1];
    if (getBaseName(lastFile) === getBaseName(file)) {
      if (file.length > lastFile.length) {
        result[result.length - 1] = file;
      }
    } else {
      result.push(file);
    }
  }

  return result;
};

/**
 * Recursively walks a directory and builds a tree of files and folders.
 * Deduplicates files by basename with priority based on filename length.
 *
 * @param {string} dir - Directory path to traverse.
 * @param {string} base - Base path prefix for recursion.
 * @returns {Array<{ name: string; path: string; children?: any[] }>} Tree nodes.
 */
const walk = (
  dir: string,
  base = ''
): { name: string; path: string; children?: any[] }[] => {
  const entries = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e) => !IGNORED_FOLDERS_SET.has(e.name))
    .sort((a, b) => a.name.localeCompare(b.name));

  const files = entries
    .filter(
      (e) =>
        !e.isDirectory() &&
        (e.name.endsWith(FILE_EXT_MD) || e.name.endsWith(FILE_EXT_MDX))
    )
    .map((e) => e.name);

  const deduplicatedFiles = deduplicateFiles(files);

  return entries
    .map((entry) => {
      if (IGNORED_FOLDERS_SET.has(entry.name)) return null;

      const fullPath = path.join(dir, entry.name);
      const fileName = entry.name.replace(REGEX_EXTENSION, '');
      const kebabPath = path.join(base, toKebabCase(fileName));
      const prettyFileName = fileName.replace(RegexPatterns.SheetSuffix, '');

      if (entry.isDirectory()) {
        return {
          name: toTitleCase(prettyFileName),
          path: kebabPath,
          children: walk(fullPath, kebabPath),
        };
      }

      if (
        entry.name.endsWith(FILE_EXT_MD) ||
        entry.name.endsWith(FILE_EXT_MDX)
      ) {
        if (!deduplicatedFiles.includes(entry.name)) {
          return null; // Skip duplicate files
        }
        return {
          name: toTitleCase(prettyFileName),
          path: kebabPath,
        };
      }

      return null;
    })
    .filter(Boolean) as any[];
};

const contentDir = getContentFolder();
const tree = walk(contentDir);

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme =
    (await cookies()).get(PersistentData.Theme)?.value || Theme.Dark;

  return (
    <html lang='en'>
      {/* @ts-ignore */}
      <body theme={theme} className=''>
        {/* @ts-ignore */}
        <ResponsiveLayoutShell theme={theme} tree={tree}>
          {children}
        </ResponsiveLayoutShell>
      </body>
    </html>
  );
}
