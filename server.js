const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// OAuth credentials - use environment variables!
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI || 'http://localhost:3000/callback';

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('❌ Error: GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables are required!');
  console.error('Set them before starting the server.');
  process.exit(1);
}

// Step 1: Start OAuth flow
app.get('/auth', (req, res) => {
  const authUrl = `https://accounts.google.com/o/oauth2/auth?` +
    `client_id=${CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
    `response_type=code&` +
    `scope=${encodeURIComponent('https://www.googleapis.com/auth/calendar.readonly')}&` +
    `prompt=consent`;
  
  res.redirect(authUrl);
});

// Step 2: Handle OAuth callback and exchange code for refresh token
app.get('/callback', async (req, res) => {
  const { code, error } = req.query;
  
  if (error) {
    return res.send(`
      <h1>Authorization Failed</h1>
      <p>Error: ${error}</p>
      <p>Description: ${req.query.error_description || 'No description'}</p>
    `);
  }
  
  if (!code) {
    return res.send('<h1>No authorization code received</h1>');
  }
  
  try {
    // Exchange code for tokens
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: REDIRECT_URI
    });
    
    const { access_token, refresh_token, expires_in } = tokenResponse.data;
    
    // Success! Display the refresh token
    res.send(`
      <h1>✅ Authorization Successful!</h1>
      <p><strong>Your Refresh Token:</strong></p>
      <pre style="background: #f0f0f0; padding: 10px; border-radius: 5px; word-break: break-all;">
${refresh_token}
      </pre>
      <p><strong>Save this token securely!</strong> You'll need it to access Google Calendar.</p>
      <p>Add this to your Railway environment variables as <code>GOOGLE_REFRESH_TOKEN</code></p>
      <hr>
      <p><small>Access token expires in: ${expires_in} seconds</small></p>
    `);
    
    // Also log it for debugging
    console.log('✅ Refresh token obtained:');
    console.log(refresh_token);
    
  } catch (error) {
    console.error('Error exchanging code:', error.response?.data || error.message);
    res.send(`
      <h1>❌ Token Exchange Failed</h1>
      <p>${error.response?.data?.error_description || error.message}</p>
    `);
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Root
app.get('/', (req, res) => {
  res.send(`
    <h1>Jaguar AI - Google Calendar OAuth</h1>
    <p><a href="/auth">Click here to authorize Google Calendar access</a></p>
  `);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Visit http://localhost:${PORT}/auth to start OAuth flow`);
});
