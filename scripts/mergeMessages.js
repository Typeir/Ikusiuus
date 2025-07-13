const fs = require('fs');
const path = require('path');
const glob = require('glob');

const MESSAGES_DIR = path.join(__dirname, '..', 'messages');

const locales = fs.readdirSync(MESSAGES_DIR).filter((file) => {
  return fs.statSync(path.join(MESSAGES_DIR, file)).isDirectory();
});

locales.forEach((locale) => {
  const pattern = path.join(MESSAGES_DIR, locale, '*.json');
  const files = glob
    .sync(pattern)
    .filter((file) => !file.endsWith('index.json'));

  let merged = {};

  files.forEach((file) => {
    const filename = path.basename(file, '.json');
    const content = JSON.parse(fs.readFileSync(file, 'utf-8'));

    merged[filename] = content;
  });

  const outputPath = path.join(MESSAGES_DIR, locale, 'index.json');
  fs.writeFileSync(outputPath, JSON.stringify(merged, null, 2), 'utf-8');

  console.log(
    `✅ ${locale}: merged ${files.length} files into index.json (namespaced)`
  );
});
