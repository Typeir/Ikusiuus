const fs = require('fs');
const path = require('path');

const CONTENT_ROOT = path.join(process.cwd(), 'content');
const IGNORED = new Set(['.git', '.obsidian', 'node_modules', '.vscode']);

/**
 * Converts a string to kebab-case.
 * @param {string} str
 * @returns {string}
 */
function toKebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .replace(/_/g, '-')
    .toLowerCase();
}

/**
 * Recursively renames folders and files to kebab-case.
 * Runs depth-first to avoid path collisions.
 * @param {string} dir
 */
function kebabifyDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  // Do directories first (depth-first traversal)
  for (const entry of entries) {
    if (IGNORED.has(entry.name)) continue;

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      kebabifyDirectory(fullPath);

      const kebabName = toKebabCase(entry.name);
      const kebabPath = path.join(dir, kebabName);

      if (entry.name !== kebabName) {
        fs.renameSync(fullPath, kebabPath);
        console.log(`📁 Renamed folder: ${entry.name} → ${kebabName}`);
      }
    }
  }

  // Then do files
  for (const entry of entries) {
    if (IGNORED.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);

    if (entry.isFile()) {
      const ext = path.extname(entry.name);
      const name = path.basename(entry.name, ext);

      if (ext === '.mdx') {
        const kebabName = toKebabCase(name);
        const newPath = path.join(dir, `${kebabName}${ext}`);

        if (entry.name !== `${kebabName}${ext}`) {
          fs.renameSync(fullPath, newPath);
          console.log(`📝 Renamed file: ${entry.name} → ${kebabName}${ext}`);
        }
      }
    }
  }
}

console.log('🔁 Kebabifying content folder...\n');
kebabifyDirectory(CONTENT_ROOT);
console.log('\n✅ All done.');
