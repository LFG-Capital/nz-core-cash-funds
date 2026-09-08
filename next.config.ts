import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // GitHub project pages live at /<repo>. Localhost keeps the root path.
  basePath: process.env.PAGES_BASE_PATH || "",
};

export default nextConfig;
