import fs from 'fs/promises';
import path from 'path';

/**
 * Attempts to resolve the correct content file for a given slug.
 * Checks for `.mdx`, `.sheet.mdx`, and `.md` in order.
 *
 * @param {string} rootDir - The content root directory (locale-specific)
 * @param {string} slugPath - The relative path to the content file (without extension)
 * @returns {Promise<string | null>} - Resolved file path or null if not found
 */
export const resolveContentFilePath = async (
  rootDir: string,
  slugPath: string
): Promise<string | null> => {
  const variants = [
    `${slugPath}.mdx`,
    `${slugPath}.sheet.mdx`,
    `${slugPath}.md`,
  ];

  for (const variant of variants) {
    const fullPath = path.join(rootDir, variant);
    try {
      await fs.access(fullPath);
      return fullPath;
    } catch {
      // File does not exist, continue to next variant
    }
  }

  return null;
};
