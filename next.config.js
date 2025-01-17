require('dotenv').config();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // API ve SSL yapılandırması
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.URL}/:path*`,
      },
    ];
  },

  env: {
    URL: process.env.URL,
  },
};

module.exports = nextConfig;
