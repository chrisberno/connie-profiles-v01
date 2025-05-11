module.exports = {
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' http://db.connie.technology:3000; frame-ancestors 'self' https://flex.twilio.com;",
          },
        ],
      },
    ];
  },
};