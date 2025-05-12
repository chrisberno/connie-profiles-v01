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
  
  // Comprehensive headers configuration for iframe embedding
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            // Modern approach using Content-Security-Policy frame-ancestors
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://db.connie.technology:3000 localhost:* wss://localhost:*; frame-ancestors 'self' https://flex.twilio.com https://*.twilio.com https://connie.team https://*.connie.team http://localhost:* https://localhost:*"
          },
          {
            // Legacy approach for older browsers
            key: 'X-Frame-Options',
            value: 'ALLOWALL'
          }
        ]
      }
    ];
  },
  
  // Enable CORS for API routes and assets
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://db.connie.technology:3000/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' }
        ]
      }
    ];
  }
};

export default nextConfig;
