import React from 'react';

export default function IframeTest() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Iframe Test Page</h1>
      <p>If you can see this page in an iframe, embedding is working correctly!</p>
      <p>Current time: {new Date().toLocaleTimeString()}</p>
      <p>
        <code>window.self !== window.top: {String(window.self !== window.top)}</code>
        <br />
        (This should be "true" if viewed in an iframe)
      </p>
    </div>
  );
}