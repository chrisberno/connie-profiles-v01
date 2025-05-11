import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://db.connie.technology:3000/:path*',
      },
    ];
  },
  
  // Temporarily remove all CSP headers for testing
  async headers() {
    return [];
  }
};

export default nextConfig;