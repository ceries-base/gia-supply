import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.GITHUB_ACTIONS ? "/gia-supply" : "",
  assetPrefix: process.env.GITHUB_ACTIONS ? "/gia-supply" : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
