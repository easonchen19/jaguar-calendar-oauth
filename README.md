# Jaguar AI - Google Calendar OAuth Handler

A simple Express.js app that handles Google Calendar OAuth authentication and generates a refresh token for your Jaguar AI assistant.

## How it works

1. User clicks `/auth` to start the OAuth flow
2. Google redirects back to `/callback` with an authorization code
3. App exchanges the code for a refresh token
4. Token is displayed and can be saved to your Railway environment

## Setup

### Local Development

```bash
npm install
npm start
```

Visit `http://localhost:3000` and click the authorize link.

### Deploy to Railway

1. Create a new Railway project
2. Connect this GitHub repo
3. Railway will auto-detect and deploy
4. After deployment, update Google Cloud Console with your Railway domain:
   - Redirect URI: `https://your-railway-app.railway.app/callback`
5. Visit your Railway app and click the authorize link
6. Copy the refresh token and add it to Railway environment variables

## Environment Variables

- `GOOGLE_CLIENT_ID` - Your Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Your Google OAuth client secret
- `REDIRECT_URI` - Your app's callback URL (auto-set for Railway)
- `PORT` - Server port (default: 3000)

## Files

- `server.js` - Main Express app
- `package.json` - Dependencies
- `.env.example` - Environment template
- `railway.json` - Railway deployment config

## Next Steps

Once you have your refresh token, you can:
1. Add it to your main Jaguar AI app's environment
2. Use the Google Calendar skill to fetch events automatically
3. Remove this app (it's only needed once)
