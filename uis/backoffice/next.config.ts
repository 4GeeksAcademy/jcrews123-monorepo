import type { NextConfig } from "next";

const internalApiUrl = (
  process.env.INTERNAL_API_URL ?? "http://localhost:8000"
).replace(/\/$/, "");

const nextConfig: NextConfig = {
  reactCompiler: true,
  transpilePackages: ["@brasaland/operations"],
  async rewrites() {
    return [
      {
        source: "/backend/:path*",
        destination: `${internalApiUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
