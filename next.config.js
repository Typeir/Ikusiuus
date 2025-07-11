const path = require('path');
const remarkGfm = require('remark-gfm').default || require('remark-gfm');

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
  webpack(config) {
    config.resolve.alias['@content'] = path.resolve(__dirname, 'src/content');
    return config;
  },
};

module.exports = withMDX(nextConfig);
