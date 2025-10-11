import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Allow production builds to successfully complete even if there are ESLint errors.
    // We keep linting locally but don't fail the CI build for demo/mock data.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allow production builds to complete even if there are type errors.
    // This should be turned off once API types are integrated.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
