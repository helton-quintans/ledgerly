import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Force Google OAuth variables to be available at runtime
  env: {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_ID: process.env.GOOGLE_CLIENT_ID, // alias
    GOOGLE_SECRET: process.env.GOOGLE_CLIENT_SECRET, // alias
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive, nosnippet, noimageindex",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
