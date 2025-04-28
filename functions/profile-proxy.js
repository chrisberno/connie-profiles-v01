exports.handler = async (context, event, callback) => {
  // Create a Twilio Response object
  const response = new Twilio.Response();
  
  // Set comprehensive CORS headers
  response.appendHeader('Access-Control-Allow-Origin', '*');  // Or specifically 'https://flex.twilio.com'
  response.appendHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.appendHeader('Access-Control-Max-Age', '3600');
  response.appendHeader('Content-Type', 'application/json');
  
  // Handle preflight OPTIONS request
  if (event.request && event.request.method === 'OPTIONS') {
    console.log('Handling OPTIONS preflight request');
    response.setStatusCode(200);
    return callback(null, response);
  }
  
  try {
    const phoneNumber = event.From ? event.From.replace(/[^+\d]/g, '') : null;
    console.log('Processing request for phone number:', phoneNumber);
    
    if (!phoneNumber) {
      response.setBody({ 
        found: false, 
        url: 'https://connie-profiles-v01.vercel.app/search' 
      });
      return callback(null, response);
    }
    
    // Query your database directly here
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection({
      host: context.DB_HOST,
      user: context.DB_USER,
      password: context.DB_PASSWORD,
      database: context.DB_NAME,
      port: context.DB_PORT || 3306,
    });
    
    const [rows] = await connection.execute(
      'SELECT * FROM profiles WHERE phone = ?',
      [phoneNumber]
    );
    await connection.end();
    
    const BASE_URL = 'https://connie-profiles-v01.vercel.app';
    
    if (rows.length > 0) {
      const profileId = rows[0].id;
      response.setBody({ 
        found: true, 
        url: `${BASE_URL}/profile/${profileId}`,
        profile: rows[0]
      });
    } else {
      response.setBody({ 
        found: false, 
        url: `${BASE_URL}/search` 
      });
    }
    
    return callback(null, response);
  } catch (error) {
    console.error('Proxy error:', error);
    response.setStatusCode(500);
    response.setBody({ 
      error: 'Internal server error', 
      url: 'https://connie-profiles-v01.vercel.app/search' 
    });
    return callback(null, response);
  }
};
