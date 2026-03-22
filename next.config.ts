import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // 跳过 TS 检查
  },
  // 核心：导出纯静态 HTML，跳过预渲染
  output: "export",
  // 移除错误的 turbopack 配置，或改为正确格式
  // turbopack: { dev: true, build: false }, // 可选：正确的 turbopack 配置
  images: {
    unoptimized: true, // 静态导出必须加，避免图片错误
  },
};

export default nextConfig;