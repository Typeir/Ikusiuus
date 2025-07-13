import fs from 'fs';
import path from 'path';

/**
 * Generates static params for localized MDX routing in Next.js App Router.
 *
 * @param {string[]} locales - List of supported locales (e.g., ['en', 'es']).
 * @param {string} contentType - Subfolder to scan (e.g., 'items', 'monsters').
 * @returns {Array<{ locale: string; slug: string }>} - Params for `generateStaticParams`.
 */
export const getLocalizedMdxParams = (
  locales: string[],
  contentType: string
) => {
  const baseDir = path.join(process.cwd(), 'src/content');
  const params: { locale: string; slug: string }[] = [];

  locales.forEach((locale) => {
    const contentDir = path.join(baseDir, locale, contentType);
    const files = fs.readdirSync(contentDir);

    files.forEach((file) => {
      if (file.endsWith('.mdx')) {
        params.push({
          locale,
          slug: file.replace(/\.mdx$/, ''),
        });
      }
    });
  });

  return params;
};
