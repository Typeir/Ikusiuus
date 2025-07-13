import fs from 'fs';
import path from 'path';
import {
  FILE_EXT_MD,
  FILE_EXT_MDX,
  IGNORED_FOLDERS,
  REGEX_EXTENSION,
  RegexPatterns,
} from '../enums/constants';
import { deduplicateFiles } from './deduplicateFiles';
import { toKebabCase } from './toKebabCase';
import { toTitleCase } from './toTitleCase';

/**
 * Recursively traverses a directory and builds a tree of files and folders.
 *
 * - Converts filenames to kebab-case paths.
 * - Deduplicates files sharing the same base name, preferring longer names.
 * - Ignores folders listed in `IGNORED_FOLDERS`.
 *
 * @param {string} dir - Directory path to traverse.
 * @param {string} base - Base path prefix for recursion (default is '').
 * @returns {Array<{ name: string; path: string; children?: any[] }>} Tree nodes for navigation.
 */
export const walk = (
  dir: string,
  base = ''
): { name: string; path: string; children?: any[] }[] => {
  const IGNORED_FOLDERS_SET = new Set<string>(IGNORED_FOLDERS);

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
