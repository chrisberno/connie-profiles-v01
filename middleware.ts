import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Skip CSP in development if NEXT_DISABLE_CSP is set
  if (process.env.NEXT_DISABLE_CSP === '1') {
    return response;
  }
  
  // Determine if we're in development mode
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Set CSP header with production focus
  const cspValue = isDevelopment
    ? "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://db.connie.technology:3000 localhost:*; frame-ancestors 'self' https://flex.twilio.com"
    : "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://db.connie.technology:3000; frame-ancestors 'self' https://flex.twilio.com";
  
  response.headers.set('Content-Security-Policy', cspValue);
  
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
