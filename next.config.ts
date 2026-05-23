import type { NextConfig } from 'next';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** 固定为仓库根目录，避免上级目录 lockfile 被误判为 monorepo 根 */
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
  // 部署/打包时以本仓库为追踪根（与上级 lockfile 无关）
  outputFileTracingRoot: projectRoot,
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
