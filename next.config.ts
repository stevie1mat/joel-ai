import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["node-llama-cpp"],
  webpack: (config) => {
    config.externals.push("node-llama-cpp");
    return config;
  },
};

export default nextConfig;
