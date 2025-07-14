import fs from 'fs/promises';
import path from 'path';
/**
 * Recursively finds all `.mdx` files in a directory.
 *
 * @param {string} dir - Directory path to search.
 * @returns {Promise<string[]>} Array of absolute paths to `.mdx` files.
 */
const findAllMdxFiles = async (dir: string): Promise<string[]> => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const res = path.resolve(dir, entry.name);
      if (entry.isDirectory()) return findAllMdxFiles(res);
      if (res.endsWith('.mdx')) return res;
      return [];
    })
  );
  return files.flat();
};

export default findAllMdxFiles;
