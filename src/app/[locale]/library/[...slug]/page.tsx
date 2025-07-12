import { getContentFolder } from '@/lib/utils/getContentFolder';
import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import ClientRenderer from '../../utils/clientRenderer';
import styles from './page.module.scss';

/**
 * Props passed to the dynamic route page, containing the MDX slug segments.
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

  // Filter out accidental duplication of locale in slug
  const slugSegments = slug[0] === locale ? slug.slice(1) : slug;

  const slugPath = slugSegments.join('/');

  // Point to correct localized content folder
  const contentRoot = getContentFolder(locale);

  /** Attempts to resolve `.mdx`, `.sheet.mdx`, or `.md` file path. */
  const resolvedPath = resolveContentFilePath(contentRoot, slugPath);

  if (!resolvedPath) {
    return <div className='p-10 text-red-400'>404 — File not found.</div>;
  }

  const rawContent = fs.readFileSync(resolvedPath, 'utf8');

  if (isMdFile(resolvedPath)) {
    const { content, data } = matter(rawContent);
    const remark = (await import('remark')).remark;
    const html = (await import('remark-html')).default;
    const gfm = (await import('remark-gfm')).default;

    const processedContent = await remark().use(gfm).use(html).process(content);
    const htmlContent = processedContent.toString();

    return (
      <div className='prose prose-invert mx-auto p-5'>
        <h1 className='text-4xl font-mono font-black mb-6'>
          {data.title ?? slugPath}
        </h1>
        <article
          className={styles.markdown}
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    );
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

/**
 * Attempts to resolve the correct file path for a content page.
 *
 * @param {string} rootDir - The absolute content root directory
 * @param {string} slugPath - The file path relative to the locale root
 * @returns {string | null} - Valid file path or null
 */
const resolveContentFilePath = (
  rootDir: string,
  slugPath: string
): string | null => {
  const mdxPath = path.join(rootDir, `${slugPath}.mdx`);
  const sheetMdxPath = path.join(rootDir, `${slugPath}.sheet.mdx`);
  const mdPath = path.join(rootDir, `${slugPath}.md`);
  console.log(mdxPath, sheetMdxPath, mdPath);

  if (fs.existsSync(mdxPath)) return mdxPath;
  if (fs.existsSync(sheetMdxPath)) return sheetMdxPath;
  if (fs.existsSync(mdPath)) return mdPath;
  return null;
};

/**
 * Determines whether a given path is a plain .md file.
 *
 * @param {string} filePath - Full file path
 * @returns {boolean}
 */
const isMdFile = (filePath: string): boolean => filePath.endsWith('.md');

export default Page;
