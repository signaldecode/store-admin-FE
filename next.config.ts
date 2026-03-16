import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  env: {
    NEXT_PUBLIC_SKIP_AUTH: process.env.NEXT_PUBLIC_SKIP_AUTH || "false",
  },
};

export default nextConfig;