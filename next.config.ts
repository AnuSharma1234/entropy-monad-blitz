import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "wagmi",
      "viem",
      "@tanstack/react-query",
    ],
  },
};

export default nextConfig;
