import React from 'react';
import Head from 'next/head';

export default function IframeTestPage() {
  return (
    <>
      <Head>
        <title>Iframe Test Page</title>
        <style jsx global>{`
          body { font-family: Arial, sans-serif; margin: 20px; }
          iframe { width: 100%; height: 600px; border: 1px solid #ccc; }
        `}</style>
      </Head>
      <div>
        <h1>Iframe Test</h1>
        <p>This page tests if the iframe embedding works correctly.</p>
        
        <h2>Production</h2>
        <iframe src="https://connie-profiles-v01.vercel.app/iframe-test" title="Iframe Test" />
        <p>If you can see content in the iframe above, embedding is working correctly!</p>
        <p>The text inside the iframe should indicate "window.self !== window.top: true"</p>
      </div>
    </>
  );
}