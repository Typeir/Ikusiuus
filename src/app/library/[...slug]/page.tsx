import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import { remark } from 'remark';
import gfm from 'remark-gfm';
import html from 'remark-html';
import styles from './page.module.scss';

const contentRoot = path.join(process.cwd(), 'content');

/**
 * Converts a string to kebab-case for consistent slug matching.
 * @param str - The input string to convert.
 * @returns The kebab-case string.
 */
function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .replace(/_/g, '-')
    .toLowerCase();
}

/**
 * Recursively finds a file path that matches a given slug.
 * @param currentDir - Directory to search in.
 * @param slugParts - Segments of the URL slug.
 * @returns The full file path or null if not found.
 */
function findFilePath(currentDir: string, slugParts: string[]): string | null {
  if (slugParts.length === 0) return null;

  const entries = fs.readdirSync(currentDir, { withFileTypes: true });

  for (const entry of entries) {
    const rawName = entry.name.replace(/\.md$/, '');
    const isMatch = toKebabCase(rawName) === slugParts[0];

    if (entry.isDirectory() && isMatch) {
      const deeper = findFilePath(
        path.join(currentDir, entry.name),
        slugParts.slice(1)
      );
      if (deeper) return deeper;
    }

    if (
      entry.isFile() &&
      entry.name.endsWith('.md') &&
      isMatch &&
      slugParts.length === 1
    ) {
      return path.join(currentDir, entry.name);
    }
  }

  return null;
}

type PageProps = {
  params: {
    slug: string[];
  };
};

/**
 * Renders a markdown-based content page from the content folder based on the slug.
 * @param props - Dynamic route parameters provided by Next.js.
 * @returns The rendered markdown content or a 404 message.
 */
export default async function Page(props: PageProps) {
  const { slug } = await props.params; // workaround for bugged compiler

  const filePath = findFilePath(contentRoot, slug);

  if (!filePath) {
    return <div className='p-10 text-red-400'>404 — File not found.</div>;
  }

  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);

  const processed = await remark().use(gfm).use(html).process(content);

  return (
    <div className='prose prose-invert mx-auto p-10'>
      <h1>{data.title || slug.join(' / ')}</h1>
      <article
        className={styles.markdown}
        dangerouslySetInnerHTML={{ __html: processed.toString() }}
      />
    </div>
  );
}
