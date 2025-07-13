import fs from 'fs/promises';
import path from 'path';

/**
 * Attempts to resolve the correct content file path for a given slug.
 * Checks for `.mdx`, `.sheet.mdx`, and `.md` variants in the provided root directory.
 *
 * @param {string} rootDir - The absolute path to the content root directory for the current locale.
 * @param {string} slugPath - The slug path joined into a single string (e.g., "library/items/metabolic-furnace").
 * @returns {Promise<string | null>} - The resolved file path if found, otherwise null.
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
      // Try next variant
    }
  }

  return null;
};
