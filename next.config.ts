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
  
  // Updated headers configuration to allow embedding in Flex
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://db.connie.technology:3000; frame-ancestors 'self' https://flex.twilio.com https://*.twilio.com *"
          }
        ]
      }
    ];
  }
};

export default nextConfig;