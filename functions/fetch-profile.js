exports.handler = async (context, event, callback) => {
  // Set CORS headers
  const response = new Twilio.Response();
  response.appendHeader('Access-Control-Allow-Origin', 'https://flex.twilio.com');
  response.appendHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
  response.appendHeader('Content-Type', 'application/json');

  const BASE_URL = 'https://connie-profiles-v01.vercel.app';

  const mysql = require('mysql2/promise');
  const connection = await mysql.createConnection({
    host: context.DB_HOST,
    user: context.DB_USER,
    password: context.DB_PASSWORD,
    database: context.DB_NAME,
    port: context.DB_PORT || 3306,
  });

  try {
    const phoneNumber = event.From ? event.From.replace(/[^+\d]/g, '') : null;
    console.log('Normalized phone number:', phoneNumber);
    if (!phoneNumber) {
      response.setBody({ found: false, url: `${BASE_URL}/search` });
      return callback(null, response);
    }

    const [rows] = await connection.execute(
      'SELECT * FROM profiles WHERE phone = ?',
      [phoneNumber]
    );
    console.log('Database query result:', rows);
    await connection.end();

    if (rows.length > 0) {
      const profileId = rows[0].id;
      response.setBody({ found: true, url: `${BASE_URL}/profile/${profileId}` });
    } else {
      response.setBody({ found: false, url: `${BASE_URL}/search` });
    }
    return callback(null, response);
  } catch (error) {
    await connection.end();
    response.setBody({ error: error.message });
    response.setStatusCode(500);
    return callback(null, response);
  }
};