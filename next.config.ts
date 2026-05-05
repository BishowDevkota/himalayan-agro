import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/about',
        destination: '/about-us/who-we-are',
        permanent: true,
      },
      {
        source: '/investor',
        destination: '/about-us/investor-relations',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
