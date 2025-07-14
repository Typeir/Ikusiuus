const fs = require('fs/promises');
const path = require('path');
const { evaluate } = require('next-mdx-remote-client/rsc');
const { compile } = require('@mdx-js/mdx');
const { pathToFileURL } = require('url');
const acorn = require('acorn');
const jsx = require('acorn-jsx');
const ReactDOMServer = require('react-dom/server');

const OUTPUT_FILE = path.join(
  process.cwd(),
  'src/lib/components/mdx/mdxComponents.tsx'
);

/**
 * Recursively finds all .mdx files in a directory.
 */
const findMdxFiles = async (dir) => {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  const files = await Promise.all(
    entries.map(async (entry) => {
      const res = path.resolve(dir, entry.name);
      if (entry.isDirectory()) return findMdxFiles(res);
      if (res.endsWith('.mdx')) return res;
      return [];
    })
  );

  return files.flat();
};

/**
 * Converts kebab-case or snake_case to PascalCase.
 */
const pascalCase = (str) =>
  str
    .replace(/[-_]+/g, ' ')
    .replace(/(?:^|\s)(\w)/g, (_, c) => c.toUpperCase())
    .replace(/\s+/g, '');

/**
 * Recursively walks the AST and extracts reusable component references.
 */
const visitAst = (node, tags) => {
  if (node.type === 'JSXElement') {
    const nameNode = node.openingElement.name;

    if (nameNode.type === 'JSXIdentifier') {
      if (/^[A-Z]/.test(nameNode.name)) {
        tags.add(nameNode.name);
      }
    }

    if (
      nameNode.type === 'JSXMemberExpression' &&
      nameNode.object.name === '_components' &&
      /^[A-Z]/.test(nameNode.property.name)
    ) {
      tags.add(nameNode.property.name);
    }
  }

  for (const key in node) {
    if (!Object.prototype.hasOwnProperty.call(node, key)) continue;
    const child = node[key];

    if (Array.isArray(child)) {
      child.forEach((c) => {
        if (c && typeof c.type === 'string') visitAst(c, tags);
      });
    } else if (child && typeof child.type === 'string') {
      visitAst(child, tags);
    }
  }
};

/**
 * Extracts component tags from compiled MDX.
 */
const extractTags = (compiledJs) => {
  const Parser = acorn.Parser.extend(jsx());
  const ast = Parser.parse(compiledJs, {
    ecmaVersion: 'latest',
    sourceType: 'module',
  });

  const tags = new Set();
  visitAst(ast, tags);
  return tags;
};

(async () => {
  const contentRoot = path.join(process.cwd(), 'src/content');
  const mdxFiles = await findMdxFiles(contentRoot);

  // Build PascalCase map of .mdx filenames
  const mdxMap = {};
  for (const file of mdxFiles) {
    const base = path.basename(file, '.mdx');
    mdxMap[pascalCase(base)] = file;
  }

  // Detect outliers
  const outliers = new Set();

  for (const file of mdxFiles) {
    const rawContent = await fs.readFile(file, 'utf8');
    const compiled = await compile(rawContent, {
      jsx: true,
      outputFormat: 'program',
    });

    const tags = extractTags(String(compiled.value));

    for (const tag of tags) {
      if (mdxMap[tag]) {
        outliers.add(tag);
      }
    }
  }

  console.log(`Found ${outliers.size} reusable MDX components:\n`);

  let output = `/**
 * Auto-generated MDX components. Do not edit manually.
 */

import { jsx as _jsx } from 'react/jsx-runtime';

const mdxComponents: any = {};\n\n`;

  for (const tag of outliers) {
    const filePath = mdxMap[tag];
    const rawContent = await fs.readFile(filePath, 'utf8');

    const result = await evaluate({
      source: rawContent,
      components: {},
      options: {
        parseFrontmatter: true,
        mdxOptions: {
          baseUrl: pathToFileURL(filePath).toString(),
        },
      },
    });

    // Render to HTML string
    const html = ReactDOMServer.renderToStaticMarkup(result.content);

    // Create dangerouslySetInnerHTML wrapper
    output += `mdxComponents.${tag} = (props: any) => _jsx('div', { dangerouslySetInnerHTML: { __html: ${JSON.stringify(
      html
    )} }, ...props });\n\n`;

    console.log(`✅ ${tag}: compiled and rendered from ${filePath}`);
  }

  output += `export default mdxComponents;\n`;

  await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
  await fs.writeFile(OUTPUT_FILE, output, 'utf8');

  console.log(`\n✨ Wrote compiled components to ${OUTPUT_FILE}`);
})();
