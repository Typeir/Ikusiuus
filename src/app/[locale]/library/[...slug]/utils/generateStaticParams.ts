import { getContentFolder } from '@/lib/utils/getContentFolder';
import fs from 'fs/promises';
import path from 'path';

export const generateStaticParams = async () => {
  const locales = ['en', 'es'];
  const paths: any[] = [];

  for (const locale of locales) {
    const dir = getContentFolder(locale);
    const files = await getAllContentFiles(dir);

    files.forEach((file) => {
      const slug = file.replace(/\.(mdx|sheet\.mdx|md)$/, '').split(path.sep);
      paths.push({ locale, slug });
    });
  }

  return paths;
};

/**
 * Recursively collects all content files with allowed extensions.
 */
const getAllContentFiles = async (dir: string): Promise<string[]> => {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  const files = await Promise.all(
    entries.map(async (entry) => {
      const res = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return getAllContentFiles(res);
      } else if (/\.(mdx|sheet\.mdx|md)$/.test(entry.name)) {
        return [res];
      }
      return [];
    })
  );

  return files.flat();
};
