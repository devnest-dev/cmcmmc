import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
    // 31 days. Source images in /public rarely change; rename the file to bust the cache.
    minimumCacheTTL: 2678400,
    // Default minus 2048/3840 so full-width images never exceed 1920px on high-DPR screens.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
  async redirects() {
    return [
      {
        // Old 5 MB OG image; previously shared links still point here.
        source: "/cover.png",
        destination: "/cover.jpg",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
