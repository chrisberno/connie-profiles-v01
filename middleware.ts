import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the response
  const response = NextResponse.next();
  
  // Add headers to allow embedding in Flex
  response.headers.set('X-Frame-Options', 'ALLOW-FROM https://flex.twilio.com');
  response.headers.set('Content-Security-Policy', 
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; " +
    "connect-src 'self' https://db.connie.technology:3000; " + 
    "frame-ancestors 'self' https://flex.twilio.com https://*.twilio.com https://connie.team https://dev.connie.team");
  
  // Handle OPTIONS preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': 'https://flex.twilio.com',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
        'X-Frame-Options': 'ALLOW-FROM https://flex.twilio.com',
        'Content-Security-Policy': "frame-ancestors 'self' https://flex.twilio.com https://*.twilio.com https://connie.team https://dev.connie.team"
      }
    });
  }
  
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
