import fs from 'fs/promises';
import { evaluate, EvaluateOptions } from 'next-mdx-remote-client/rsc';
import { notFound } from 'next/navigation';

import components from '@/lib/components/mdx';
import { isMdFile } from '@/lib/md/isMdFile';
import findAllMdxFiles from '@/lib/mdx/findAllMdxFiles';
import { getContentFolder } from '@/lib/utils/getContentFolder';
import { resolveContentFilePath } from '@/lib/utils/resolveContentFilePath';
import path from 'path';
import remarkGfm from 'remark-gfm';
import { pathToFileURL } from 'url';
import ClientRenderer from '../../utils/clientRenderer';
import styles from './page.module.scss';
import { MDRawPage } from './utils/mdRawPage';

/**
 * Generates all static params for dynamic `[...slug]` route.
 *
 * Next.js uses this at build time to statically generate all MDX pages.
 *
 * @returns {Promise<Array<{ slug: string[] }>>} Array of slug params.
 */
export async function generateStaticParams(): Promise<
  Array<{ slug: string[] }>
> {
  const CONTENT_ROOT = path.join(process.cwd(), 'public', 'content', 'en');
  const mdxFiles = await findAllMdxFiles(CONTENT_ROOT);
  return mdxFiles.map((filePath) => {
    const relativePath = path.relative(CONTENT_ROOT, filePath);
    const slug = relativePath.replace(/\.mdx$/, '').split(path.sep);
    return { slug };
  });
}
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
 * Dynamic content page with fallback to ClientRenderer if MDX precompilation fails.
 *
 * @param {PageProps} props - Route params
 * @returns {JSX.Element} Rendered page or fallback
 */
const Page = async ({ params }: PageProps) => {
  const { slug, locale } = await params;

  // Normalize slug: handle accidental locale duplication
  const slugSegments = slug[0] === locale ? slug.slice(1) : slug;
  const slugPath = slugSegments.join('/');

  const contentRoot = getContentFolder(locale);
  const resolvedPath = await resolveContentFilePath(contentRoot, slugPath);

  if (!resolvedPath) {
    notFound();
  }

  const rawContent = await fs.readFile(resolvedPath, 'utf8');

  // Render raw .md as-is
  if (isMdFile(resolvedPath)) {
    return <MDRawPage slugPath={slugPath} rawContent={rawContent} />;
  }

  // Try to precompile MDX via `evaluate`
  let result;

  try {
    result = await evaluate({
      source: rawContent,
      components,
      options: {
        parseFrontmatter: true,
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          baseUrl: pathToFileURL(resolvedPath).toString(),
        },
      } as unknown as EvaluateOptions,
    });
  } catch (error) {
    console.warn(
      'Catastrophic error when parsing mdx, falling back to client renderer'
    );
  } finally {
    if (!result || result.error) {
      console.warn(
        `MDX precompilation failed for ${slugPath}, falling back to ClientRenderer:`,
        result?.error
      );
      return (
        <div className='prose prose-invert mx-auto p-5'>
          <h1 className='text-4xl font-mono font-black mb-6'>{slugPath}</h1>
          <article className={styles.markdown}>
            <ClientRenderer locale={locale} slug={slugPath} />
          </article>
        </div>
      );
    }
  }

  const { content, frontmatter } = result;

  return (
    <div className='prose prose-invert mx-auto p-5'>
      <article className={styles.markdown}>{content}</article>
    </div>
  );
};

export default Page;

// export const dynamic = 'force-static';
