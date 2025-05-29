import React from 'react';
import Head from 'next/head';

export default function StaticTest() {
  return (
    <>
      <Head>
        <title>Static Embedding Test</title>
        {/* Add meta tags to ensure proper embedding */}
        <meta httpEquiv="Content-Security-Policy" content="frame-ancestors 'self' https://flex.twilio.com https://*.twilio.com https://connie.team https://dev.connie.team" />
      </Head>
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>Static Embedding Test</h1>
        <p>This is a completely static page with no database calls.</p>
        <p>If you can see this in Flex, we know the basic embedding works.</p>
        <p>Current time: {new Date().toLocaleTimeString()}</p>
        <hr />
        <div style={{ marginTop: '20px' }}>
          <h2>Debug Information:</h2>
          <p>URL: {typeof window !== 'undefined' ? window.location.href : 'Server rendering'}</p>
          <p>Embedded in iframe: {typeof window !== 'undefined' ? String(window.self !== window.top) : 'Server rendering'}</p>
          <p>Parent domain: {typeof window !== 'undefined' && window.parent ? 'Has parent' : 'No parent or blocked by CORS'}</p>
        </div>
      </div>
    </>
  );
}

// Server-side props to set headers
export async function getServerSideProps({ res }) {
  if (res) {
    // Set permissive headers for testing
    res.setHeader('X-Frame-Options', 'ALLOW-FROM https://flex.twilio.com https://*.twilio.com https://connie.team https://dev.connie.team');
    res.setHeader('Content-Security-Policy', "frame-ancestors 'self' https://flex.twilio.com https://*.twilio.com https://connie.team https://dev.connie.team");
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  
  return { props: {} };
}