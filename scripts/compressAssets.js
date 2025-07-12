// @ts-check

/**
 * Compresses full-resolution images from `public/full-size` into `.webp` format,
 * saving optimized versions in `public/library/images` with mirrored structure.
 *
 * Supported formats: .png, .jpg, .jpeg
 * Keeps originals untouched.
 */

const fs = require('fs/promises');
const { globby } = require('globby');
const path = require('path');
const sharp = require('sharp');

/** Directory containing original full-resolution assets */
const SOURCE_DIR = 'public/full-size';

/** Output directory for compressed webp images */
const OUTPUT_DIR = 'public/library';

/** Resize limit (max width in pixels) */
const MAX_WIDTH = 1600;

/**
 * Compress and convert images from SOURCE_DIR to OUTPUT_DIR as WebP.
 *
 * @returns {Promise<void>}
 */
const compressImages = async () => {
  /** @type {string[]} */
  const files = await globby(`${SOURCE_DIR}/**/*.{png,jpg,jpeg,JPG}`, {
    absolute: true,
  });

  console.log(`🗂 Found ${files.length} images in ${SOURCE_DIR}\n`);

  for (const file of files) {
    /** Relative path from SOURCE_DIR (e.g. "maps/region.png") */
    const relative = path.relative(SOURCE_DIR, file);

    /** Output path in OUTPUT_DIR, replacing extension with .webp */
    const outputPath = path.join(
      OUTPUT_DIR,
      relative.replace(/\.(png|jpe?g)$/i, '.webp')
    );

    try {
      // Skip if already compressed
      await fs.access(outputPath);
      console.log(`↷ Skipped (already exists): ${relative}`);
      continue;
    } catch {
      // Continue — file does not exist yet
    }

    await fs.mkdir(path.dirname(outputPath), { recursive: true });

    try {
      await sharp(file)
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(outputPath);

      console.log(`✓ Compressed: ${relative}`);
    } catch (err) {
      console.error(`✗ Failed: ${relative}`);
      console.error(err);
    }
  }

  console.log('\n✅ All images processed.');
};

// Run the script
compressImages().catch((err) => {
  console.error('✖ Unexpected script error');
  console.error(err);
  process.exit(1);
});
