const fs = require('fs');
const path = require('path');
const glob = require('glob');

const MESSAGES_DIR = path.join(__dirname, '..', 'messages');

if (process.env.VERCEL !== '1') {
  console.log('🚫 Skipping cleanup: not running in Vercel');
  process.exit(0);
}

const locales = fs.readdirSync(MESSAGES_DIR).filter((file) => {
  return fs.statSync(path.join(MESSAGES_DIR, file)).isDirectory();
});

locales.forEach((locale) => {
  const pattern = path.join(MESSAGES_DIR, locale, '*.json');
  const files = glob.sync(pattern);

  files.forEach((file) => {
    if (!file.endsWith('index.json')) {
      fs.unlinkSync(file);
      console.log(`🗑️ Deleted ${file}`);
    }
  });
});

console.log('✅ Translation cleanup complete (only index.json kept).');
