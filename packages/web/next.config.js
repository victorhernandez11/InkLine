const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias['@shared'] = path.resolve(__dirname, '../shared/src');
    // Ensure monorepo siblings can resolve packages installed here
    config.resolve.modules = [
      path.resolve(__dirname, 'node_modules'),
      'node_modules',
    ];
    return config;
  },
  transpilePackages: ['../shared', '../lite/src'],
};

module.exports = nextConfig;
