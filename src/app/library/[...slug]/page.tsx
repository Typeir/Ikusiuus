import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import ClientRenderer from '../../../lib/components/mdx/clientRenderer';
import styles from './page.module.scss';

/**
 * Props passed to the dynamic route page, containing the MDX slug segments.
 */
type PageProps = {
  params: {
    slug: string[];
  };
};

/**
 * A dynamic page renderer for MDX-based content under `/src/content`.
 * Supports `.mdx` and fallback `.sheet.mdx` files.
 *
 * @param {PageProps} props - The route parameters containing the slug.
 * @returns {JSX.Element} - The rendered page or a 404 message.
 */
const Page = async ({ params }: PageProps) => {
  const { slug } = await params;
  const slugSegments = slug;
  const slugPath = slugSegments.join('/');

  const contentRoot = path.join(process.cwd(), 'src', 'content');

  /** Attempts to resolve `.mdx` or `.sheet.mdx` file path. */
  const resolvedPath = resolveMdxFilePath(contentRoot, slugPath);

  if (!resolvedPath) {
    return <div className='p-10 text-red-400'>404 — File not found.</div>;
  }

  const rawContent = fs.readFileSync(resolvedPath, 'utf8');
  const { data } = matter(rawContent);

  return (
    <div className='prose prose-invert mx-auto p-5'>
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
 * Attempts to resolve the correct file path for an MDX page.
 * Checks for `${slug}.mdx` first, then falls back to `${slug}.sheet.mdx`.
 *
 * @param {string} rootDir - The absolute path to the content root.
 * @param {string} slugPath - The joined slug representing the relative file path.
 * @returns {string | null} - The resolved file path, or null if not found.
 */
const resolveMdxFilePath = (
  rootDir: string,
  slugPath: string
): string | null => {
  const primary = path.join(rootDir, `${slugPath}.mdx`);
  const fallback = path.join(rootDir, `${slugPath}.sheet.mdx`);

  if (fs.existsSync(primary)) return primary;
  if (fs.existsSync(fallback)) return fallback;

  return null;
};

export default Page;
