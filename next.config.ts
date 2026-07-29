import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  cacheComponents: true,
  images: {
    remotePatterns : [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  skipTrailingSlashRedirect: true,

};


export default nextConfig;
