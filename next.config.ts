import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://db.connie.technology:3000/:path*',
      },
    ];
  },

  // Add Webpack config to avoid eval() in production
  webpack: (config, { dev }) => {
    if (!dev) {
      config.output.devtoolModuleFilenameTemplate = undefined;
      config.output.devtoolFallbackModuleFilenameTemplate = undefined;
    }
    return config;
  },

  // Add headers configuration with production-focused CSP
  async headers() {
    const isDevelopment = process.env.NODE_ENV === 'development';

    const cspValue = isDevelopment
      ? "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://db.connie.technology:3000 localhost:*; frame-ancestors 'self' https://flex.twilio.com"
      : "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://db.connie.technology:3000; frame-ancestors 'self' https://flex.twilio.com";

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: ''
          },
          {
            key: 'Content-Security-Policy',
            value: cspValue
          }
        ]
      }
    ];
  }
};

export default nextConfig;