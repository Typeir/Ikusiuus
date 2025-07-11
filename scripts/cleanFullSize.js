// @ts-check

/**
 * Removes the full-size image folder after build.
 * Only runs in Vercel to avoid local nuking.
 */

const fs = require('fs');
const path = require('path');

/** Absolute path to the full-size source image folder */
const fullSizePath = path.join(process.cwd(), 'public', 'full-size');

if (process.env.VERCEL !== '1') {
  console.log('🚫 Skipping cleanup: not running in Vercel');
  process.exit(0);
}

try {
  if (fs.existsSync(fullSizePath)) {
    fs.rmSync(fullSizePath, { recursive: true, force: true });
    console.log('🧹 Removed public/full-size (Vercel post-build cleanup)');
  } else {
    console.log('✅ No full-size folder to remove');
  }
} catch (err) {
  console.error('✖ Error cleaning full-size folder:', err);
  process.exit(1);
}
