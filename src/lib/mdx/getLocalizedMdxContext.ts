// import fs from 'fs';
// import type { EvaluateOptions } from 'next-mdx-remote-client/rsc';
// import { evaluate } from 'next-mdx-remote-client/rsc';
// import path from 'path';

// /**
//  * Loads precompiled MDX code and returns a React component.
//  *
//  * @param {string} locale - The locale folder (e.g., 'en').
//  * @param {string} contentType - The type of the content.
//  * @param {string} slug - The path to the content (e.g., 'items/spear-of-paimar').
//  * @returns {string} The default exported component from the compiled file.
//  */
// export async function getLocalizedMdxContent({
//   locale,
//   contentType,
//   slug,
// }: {
//   locale: string;
//   contentType: string;
//   slug: string;
// }) {
//   const file = path.join(
//     process.cwd(),
//     'src/content',
//     locale,
//     contentType,
//     `${slug}.mdx`
//   );
//   const source = fs.readFileSync(file, 'utf-8');

//   const options: EvaluateOptions = {
//     parseFrontmatter: true,
//     // optionally add remark/rehype/vfile options here
//   };

//   const result = await evaluate({ source, options });

//   return result; // contains { content, frontmatter, scope, error }
// }
