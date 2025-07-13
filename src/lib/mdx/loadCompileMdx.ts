// import fs from 'fs/promises';
// import path from 'path';

// /**
//  * Loads precompiled MDX as a React component.
//  * @param {string} locale - The locale (e.g., 'en').
//  * @param {string} slugPath - Path like 'items/spear-of-paimar'.
//  * @returns {Promise<React.Component>}
//  */
// export const loadCompiledMdx = async (locale: string, slugPath: any) => {
//   const compiledPath = path.join(
//     process.cwd(),
//     'src/compiled-content',
//     locale,
//     `${slugPath}.js`
//   );

//   // Clear require cache for hot reload
//   delete require.cache[require.resolve(compiledPath)];

//   const code = await fs.readFile(compiledPath, 'utf8');

//   const exports = {};
//   const module = { exports };
//   const wrapped = new Function('exports', 'module', 'require', code);
//   wrapped(exports, module, require);
//   console.log(module);

//   return module.exports.default;
// };
