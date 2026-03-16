import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    /** Next.js 16 global-error prerender 버그 우회 */
    staticGenerationRetryCount: 0,
  },
};

export default nextConfig;
