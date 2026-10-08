import type { NextConfig } from "next";

const isStaticExport = process.env.STATIC_EXPORT === "true" || process.env.GITHUB_PAGES === "true";
const staticBasePath = isStaticExport
  ? (process.env.STATIC_BASE_PATH ?? process.env.PAGES_BASE_PATH ?? "")
  : "";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  ...(isStaticExport
    ? {
        output: "export",
        trailingSlash: true,
        basePath: staticBasePath,
        assetPrefix: staticBasePath,
        images: {
          unoptimized: true,
        },
      }
    : {}),
};

export default nextConfig;
