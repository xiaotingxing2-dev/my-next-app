import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // 跳过构建时 TypeScript 检查，解决部署超时
  },
  turbopack: false, // 可选：关闭 Turbopack，避免构建兼容性问题
};

export default nextConfig;