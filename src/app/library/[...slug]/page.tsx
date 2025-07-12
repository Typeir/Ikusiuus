import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import { getContentFolder } from '../../../lib/utils/getContentFolder';
import ClientRenderer from '../../utils/clientRenderer';
import styles from './page.module.scss';

/**
 * Props passed to the dynamic route page, containing the MDX slug segments.
 */
type PageProps = {
  params: Promise<{
    slug: string[];
  }>;
};

/**
 * A dynamic page renderer for content under `/src/content`.
 * Supports `.mdx`, `.sheet.mdx`, and `.md` files.
 *
 * @param {PageProps} props - The route parameters containing the slug.
 * @returns {JSX.Element} - The rendered page or a 404 message.
 */
const Page = async ({ params }: PageProps) => {
  const { slug } = await params;
  const slugSegments = slug;
  const slugPath = slugSegments.join('/');

  const contentRoot = getContentFolder();

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
    <div className='prose prose-invert mx-auto p-5 '>
      <h1 className='text-4xl font-mono font-black mb-6'>
        {data.title ?? slugPath}
      </h1>
      <article className={styles.markdown}>
        <ClientRenderer slug={slugPath} />
      </article>
    </div>
  );
};

/**
 * Attempts to resolve the correct file path for a content page.
 * Checks for `${slug}.mdx`, then `.sheet.mdx`, then `.md`.
 *
 * @param {string} rootDir - The absolute path to the content root.
 * @param {string} slugPath - The joined slug representing the relative file path.
 * @returns {string | null} - The resolved file path, or null if not found.
 */
const resolveContentFilePath = (
  rootDir: string,
  slugPath: string
): string | null => {
  const mdxPath = path.join(rootDir, `${slugPath}.mdx`);
  const sheetMdxPath = path.join(rootDir, `${slugPath}.sheet.mdx`);
  const mdPath = path.join(rootDir, `${slugPath}.md`);

  if (fs.existsSync(mdxPath)) return mdxPath;
  if (fs.existsSync(sheetMdxPath)) return sheetMdxPath;
  if (fs.existsSync(mdPath)) return mdPath;

  return null;
};

/**
 * Determines whether the file is a raw Markdown `.md` file.
 *
 * @param {string} filePath - The resolved file path.
 * @returns {boolean} - True if it's a `.md` file.
 */
const isMdFile = (filePath: string): boolean => filePath.endsWith('.md');

export default Page;
