require('dotenv').config();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        // Optionally, specify a pathname pattern, e.g., '/photos/**' if needed
        pathname: '/**',
      },
    ],
  },
  // API ve SSL yapılandırması
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || process.env.URL}/:path*`,
      },
    ];
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    URL: process.env.URL,
  },
};

module.exports = nextConfig;
