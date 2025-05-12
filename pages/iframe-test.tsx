import React from 'react';
import { useEffect, useState } from 'react';

// This tells Next.js not to pre-render this page
export const dynamic = 'force-dynamic';

export default function IframeTest() {
  // Initialize state with null values
  const [isClient, setIsClient] = useState(false);
  const [isInIframe, setIsInIframe] = useState<boolean | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');

  // Only run this effect on the client side
  useEffect(() => {
    setIsClient(true);
    
    // Now it's safe to access window
    setIsInIframe(window.self !== window.top);
    setCurrentTime(new Date().toLocaleTimeString());
    
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Server-side render a simple placeholder
  if (!isClient) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Iframe Test Page</h1>
        <p>Loading...</p>
      </div>
    );
  }

  // Client-side render with full functionality
  return (
    <div style={{ padding: '20px' }}>
      <h1>Iframe Test Page</h1>
      <p>If you can see this page in an iframe, embedding is working correctly!</p>
      <p>Current time: {currentTime}</p>
      {isInIframe !== null && (
        <p>
          <code>window.self !== window.top: {String(isInIframe)}</code>
          <br />
          (This should be "true" if viewed in an iframe)
        </p>
      )}
    </div>
  );
}
