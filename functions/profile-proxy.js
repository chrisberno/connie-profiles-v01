const axios = require('axios');

exports.handler = async (context, event, callback) => {
  try {
    console.log('Incoming request with phone:', event.From);
    
    const axiosResponse = await axios.get('http://db.connie.technology:3000/all-profiles');
    const profiles = axiosResponse.data.profiles;
    const phoneNumber = event.From;
    const profile = profiles.find(p => p.phone === phoneNumber);

    // Create a response object that Flex expects
    const responseObject = {
      success: true
    };
    
    // Add a timestamp parameter to force a fresh load and prevent caching issues
    const timestamp = new Date().getTime();
    
    if (profile) {
      console.log('Profile found:', profile.id);
      // Add a special parameter to indicate this is coming from Flex
      responseObject.crm_url = `https://connie-profiles-v01.vercel.app/profile/${profile.id}?source=flex&t=${timestamp}`;
    } else {
      console.log('No profile found, using search page');
      responseObject.crm_url = `https://connie-profiles-v01.vercel.app/search?source=flex&t=${timestamp}`;
    }
    
    // Return proper CORS headers for Flex
    const twilioResponse = new Twilio.Response();
    twilioResponse.appendHeader('Access-Control-Allow-Origin', '*');
    twilioResponse.appendHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    twilioResponse.appendHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    twilioResponse.appendHeader('Content-Type', 'application/json');
    twilioResponse.setBody(responseObject);
    
    return callback(null, twilioResponse);
  } catch (error) {
    console.error('API error:', error.message);
    
    // Return error with proper CORS headers
    const twilioResponse = new Twilio.Response();
    twilioResponse.appendHeader('Access-Control-Allow-Origin', '*');
    twilioResponse.appendHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    twilioResponse.appendHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    twilioResponse.appendHeader('Content-Type', 'application/json');
    twilioResponse.setStatusCode(500);
    twilioResponse.setBody({ 
      success: false, 
      error: error.message,
      crm_url: `https://connie-profiles-v01.vercel.app/header-test?error=true&t=${new Date().getTime()}`
    });
    
    return callback(null, twilioResponse);
  }
};
