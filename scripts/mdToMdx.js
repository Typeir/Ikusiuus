const fs = require('fs');
const path = require('path');

/**
 * The root directory containing markdown files.
 * @type {string}
 */
const contentRoot = path.join(__dirname, '../content');

/**
 * Recursively walks a directory and renames all `.md` files to `.mdx`.
 *
 * - Only affects files ending in `.md`
 * - Preserves directory structure
 * - Logs each rename to the console
 *
 * @param {string} dir - The directory to traverse
 * @returns {void}
 */
function renameMarkdownToMdx(dir) {
  /** @type {fs.Dirent[]} */
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      renameMarkdownToMdx(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      /** @type {string} */
      const newPath = fullPath.replace(/\.(md|mdx)$/, '.mdx');

      try {
        fs.renameSync(fullPath, newPath);
        console.log(`✅ Renamed: ${fullPath} → ${newPath}`);
      } catch (err) {
        console.error(`❌ Failed to rename ${fullPath}:`, err);
      }
    }
  }
}

// Start the recursive rename process
renameMarkdownToMdx(contentRoot);
