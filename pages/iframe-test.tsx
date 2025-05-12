'use client'

import React, { useEffect, useState } from 'react';

export default function IframeTest() {
  const [isInIframe, setIsInIframe] = useState<boolean | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    // Only access window object in useEffect (client-side)
    setIsInIframe(window.self !== window.top);
    setCurrentTime(new Date().toLocaleTimeString());
    
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

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
