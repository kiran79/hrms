import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@bharat-hrms/domain"],
  typedRoutes: true
};

export default nextConfig;
