import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import ClientRenderer from '../../../lib/components/mdx/clientRenderer';
import styles from './page.module.scss';

export default async function Page({ params }: { params: { slug: string[] } }) {
  const { slug: baseSlug } = await params;
  const slug = baseSlug.join('/');
  const contentPath = path.join(process.cwd(), 'src', 'content');
  const filePath = fs.existsSync(`${contentPath}/${slug}.mdx`)
    ? `${contentPath}/${slug}.mdx`
    : `${contentPath}/${slug}.sheet.mdx`;

  if (!fs.existsSync(filePath)) {
    return <div className='p-10 text-red-400'>404 — File not found.</div>;
  }

  const raw = fs.readFileSync(filePath, 'utf8');
  const { data } = matter(raw);

  return (
    <div className='prose prose-invert mx-auto p-5'>
      <h1 className='text-4xl font-mono font-black mb-6'>
        {data.title ?? slug}
      </h1>
      <article className={styles.markdown}>
        <ClientRenderer slug={slug} />
      </article>
    </div>
  );
}
