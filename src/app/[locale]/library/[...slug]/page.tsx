import fs from 'fs/promises';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';

import { getContentFolder } from '@/lib/utils/getContentFolder';
import { isMdFile } from '@/lib/utils/isMdFile';
import { resolveContentFilePath } from '@/lib/utils/resolveContentFilePath';
import ClientRenderer from '../../utils/clientRenderer';
import styles from './page.module.scss';
import { MDRawPage } from './utils/mdRawPage';

/**
 * Props for the dynamic content route.
 */
type PageProps = {
  params: Promise<{
    slug: string[];
    locale: string;
  }>;
};
/**
 * Dynamic content page renderer based on slug and locale.
 * Attempts to load `.mdx`, `.sheet.mdx`, or `.md` files from localized folders.
 *
 * @param {PageProps} props - Route params
 * @returns {JSX.Element} Rendered page or 404 message
 */
const Page = async ({ params }: PageProps) => {
  const { slug, locale } = await params;

  // Handle accidental locale duplication in slug
  const slugSegments = slug[0] === locale ? slug.slice(1) : slug;
  const slugPath = slugSegments.join('/');

  const contentRoot = getContentFolder(locale);
  const resolvedPath = await resolveContentFilePath(contentRoot, slugPath);

  if (!resolvedPath) {
    notFound();
  }

  const rawContent = await fs.readFile(resolvedPath, 'utf8');

  if (isMdFile(resolvedPath)) {
    return <MDRawPage slugPath={slugPath} rawContent={rawContent} />;
  }

  const { data } = matter(rawContent);
  return (
    <div className='prose prose-invert mx-auto p-5'>
      <h1 className='text-4xl font-mono font-black mb-6'>
        {data.title ?? slugPath}
      </h1>
      <article className={styles.markdown}>
        <ClientRenderer locale={locale} slug={slugPath} />
      </article>
    </div>
  );
};

export default Page;

export const dynamic = 'force-static';
