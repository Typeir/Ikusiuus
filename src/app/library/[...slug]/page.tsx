import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import { remark } from 'remark';
import gfm from 'remark-gfm';
import html from 'remark-html';
import styles from './page.module.scss';

const contentRoot = path.join(process.cwd(), 'content');

function toKebabCase(str: string) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .replace(/_/g, '-')
    .toLowerCase();
}

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

export default async function Page(props: { params: { slug: string[] } }) {
  const { slug } = await props.params;

  const filePath = findFilePath(contentRoot, slug);

  if (!filePath) {
    return <div className='p-10 text-red-400'>404 — File not found.</div>;
  }

  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);

  const processed = await remark()
    .use(gfm) // ← enable GFM
    .use(html)
    .process(content);

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
