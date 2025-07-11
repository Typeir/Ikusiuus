/** @type {import('next').NextConfig} */
const nextConfig = {};

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
});

const path = require('path');

module.exports = {};

module.exports = withMDX({
  pageExtensions: ['ts', 'tsx', 'mdx'],
  webpack(config) {
    config.resolve.alias['~content'] = path.resolve(__dirname, 'content');
    return config;
  },
});
