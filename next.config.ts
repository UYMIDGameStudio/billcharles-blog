import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Gzip is on by default; this is explicit + tree-shaking friendly.
  compress: true,
  // Stronger ETag for static asset caching.
  poweredByHeader: false,
  // Strict React behaviour.
  reactStrictMode: true,
};

export default nextConfig;
