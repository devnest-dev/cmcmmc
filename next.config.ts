import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
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
