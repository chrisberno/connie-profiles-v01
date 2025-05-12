exports.handler = async (context, event, callback) => {
  const response = new Twilio.Response();
  response.appendHeader('Access-Control-Allow-Origin', 'https://flex.twilio.com');
  response.appendHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
  response.appendHeader('Content-Type', 'application/json');

  if (event.request && event.request.method === 'OPTIONS') {
    response.setStatusCode(204);
    return callback(null, response);
  }

  // Log environment variables for debugging
  console.log('DB_HOST:', context.DB_HOST);
  console.log('DB_NAME:', context.DB_NAME);
  console.log('DB_USER:', context.DB_USER);
  console.log('DB_PASSWORD:', context.DB_PASSWORD);
  console.log('DB_PORT:', context.DB_PORT);

  // Update the BASE_URL to use the production URL
  const BASE_URL = 'https://connie-profiles-v01.vercel.app';

  // Fallback to hardcoded values if environment variables are undefined
  const dbHost = context.DB_HOST || '18.235.169.187';
  const dbPort = context.DB_PORT || '3306';
  console.log('Using DB_HOST:', dbHost);
  console.log('Using DB_PORT:', dbPort);

  // Test connectivity to the database host
  const net = require('net');
  const testConnection = () => {
    return new Promise((resolve) => {
      const socket = new net.Socket();
      socket.setTimeout(5000);
      socket.on('connect', () => {
        console.log('Successfully connected to DB host');
        socket.destroy();
        resolve(true);
      });
      socket.on('timeout', () => {
        console.log('Connection to DB host timed out');
        socket.destroy();
        resolve(false);
      });
      socket.on('error', (err) => {
        console.log('Connection to DB host failed:', err.message);
        socket.destroy();
        resolve(false);
      });
      socket.connect(dbPort, dbHost);
    });
  };

  const canConnect = await testConnection();
  if (!canConnect) {
    response.setBody({ error: 'Cannot connect to database host' });
    response.setStatusCode(500);
    return callback(null, response);
  }

  const mysql = require('mysql2/promise');
  const connection = await mysql.createConnection({
    host: dbHost,
    user: context.DB_USER,
    password: context.DB_PASSWORD,
    database: context.DB_NAME,
    port: dbPort,
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
