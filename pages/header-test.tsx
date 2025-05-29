import type { GetServerSideProps } from 'next';

export default function HeaderTest({ headers }: { headers: Record<string, string> }) {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Response Headers</h1>
      <pre style={{ background: '#f0f0f0', padding: '10px', overflow: 'auto' }}>
        {JSON.stringify(headers, null, 2)}
      </pre>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  // Add test headers directly here to ensure they're applied
  res.setHeader('X-Frame-Options', 'ALLOW-FROM https://flex.twilio.com');
  res.setHeader('Content-Security-Policy', 
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; " +
    "frame-ancestors 'self' https://flex.twilio.com https://*.twilio.com");
  
  return {
    props: {
      headers: res.getHeaders(),
    },
  };
};