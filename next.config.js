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
  async redirects() {
    return [
      {
        source: '/',
        destination: '/en',
        permanent: false,
      },
    ];
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });
    config.resolve.alias['@content'] = path.resolve(__dirname, 'src/content');
    config.resolve.alias['@lib'] = path.resolve(__dirname, 'src/lib');
    return config;
  },
};

module.exports = withMDX(nextConfig);
