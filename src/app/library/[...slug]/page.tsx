import fs from 'fs';
import matter from 'gray-matter';
import dynamic from 'next/dynamic';
import path from 'path';
import ClientMdxWrapper from '../../../lib/components/mdx/clientMdxWrapper';

type PageProps = {
  params: Promise<{
    slug: string[];
  }>;
};

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  const resolved = resolveMdx(slug);
  console.log('[content dir]', path.join(process.cwd(), 'content'));
  console.log('[resolved filePath]', resolved?.filePath);

  if (!resolved) {
    return <div className='p-10 text-red-400'>404 — File not found.</div>;
  }

  const { filePath, importPath } = resolved;
  const raw = fs.readFileSync(filePath, 'utf8');
  const { data } = matter(raw);

  const Component = dynamic(() =>
    import(importPath).then((mod) => mod.default)
  );

  return (
    <div className='prose prose-invert mx-auto p-5'>
      <h1 className='text-4xl font-mono font-black mb-6'>
        {data.title ?? slug.at(-1)}
      </h1>
      <ClientMdxWrapper>
        <Component />
      </ClientMdxWrapper>
    </div>
  );
}

/**
 * Resolves both the file path and dynamic import path for an MDX file.
 * Supports fallback from `.mdx` to `.sheet.mdx`.
 * Returns `null` if nothing matches.
 */
function resolveMdx(
  slugParts: string[]
): { filePath: string; importPath: string } | null {
  const root = path.join(process.cwd(), 'content');

  const joinedSlug = slugParts.join('/');
  const fallbackSlug = `${slugParts.slice(0, -1).join('/')}/${slugParts.at(
    -1
  )}.sheet`;

  const normalFs = path.join(root, `${joinedSlug}.mdx`);
  const sheetFs = path.join(root, `${fallbackSlug}.mdx`);

  if (fs.existsSync(normalFs)) {
    return {
      filePath: normalFs,
      importPath: `~content/${joinedSlug}.mdx`,
    };
  }

  if (fs.existsSync(sheetFs)) {
    return {
      filePath: sheetFs,
      importPath: `~content/${fallbackSlug}.mdx`,
    };
  }

  return null;
}
