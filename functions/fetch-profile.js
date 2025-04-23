exports.handler = async function(context, event, callback) {
  const mysql = require('mysql2/promise');
  
  // Base URL for your Vercel app
  const BASE_URL = 'https://connie-profiles-v01-4zuxqqz55-connie-direct.vercel.app';
  
  // Get the caller's phone number from the Studio event
  const phoneNumber = event.From || '';
  
  // Validate phone number
  if (!phoneNumber) {
    return callback(null, {
      found: false,
      url: `${BASE_URL}/search`
    });
  }

  // Configure MySQL connection
  const connection = await mysql.createConnection({
    host: context.DB_HOST,
    user: context.DB_USER,
    password: context.DB_PASSWORD,
    database: context.DB_NAME,
    port: context.DB_PORT || 3306
  });

  try {
    // Query the profiles table for the phone number
    const [rows] = await connection.execute(
      'SELECT id FROM profiles WHERE phone = ?',
      [phoneNumber]
    );

    // Close the database connection
    await connection.end();

    // Check if a profile was found
    if (rows.length > 0) {
      const profileId = rows[0].id;
      return callback(null, {
        found: true,
        url: `${BASE_URL}/profile/${profileId}`
      });
    } else {
      return callback(null, {
        found: false,
        url: `${BASE_URL}/search`
      });
    }
  } catch (error) {
    await connection.end();
    console.error('Database error:', error);
    return callback(null, {
      found: false,
      url: `${BASE_URL}/search`,
      error: 'Failed to query database'
    });
  }
};