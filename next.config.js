const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  output: process.env.NEXT_OUTPUT_MODE,
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../'),
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: process.env.NEXT_IGNORE_TS_ERRORS === '1',
  },
  images: { unoptimized: true },
  async rewrites() {
    return [
      // Proxy Size Sync Studio API mounted at /studio/api -> local Express API
      { source: '/studio/api/:path*', destination: 'http://localhost:3001/api/:path*' },
      // Proxy Size Sync Studio frontend mounted at /studio -> local Vite dev server
      { source: '/studio', destination: 'http://localhost:8080' },
      { source: '/studio/:path*', destination: 'http://localhost:8080/:path*' },
    ]
  },
};

module.exports = nextConfig;
