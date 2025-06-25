# Vercel Environment Variables Setup

## Required Environment Variables

Add these environment variables to your Vercel project:

### 1. Go to Vercel Dashboard
- Navigate to your project
- Go to **Settings** → **Environment Variables**

### 2. Add the following variables for **Preview** and **Production** environments:

```
AUTH_SECRET=your-32-character-secret-key-here
AUTH_BASE_URL=https://your-preview-url.vercel.app
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
```

### 3. Update Google OAuth Settings

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Click on your OAuth 2.0 Client ID
4. Add your Vercel URLs to **Authorized redirect URIs**:
   ```
   https://your-preview-url.vercel.app/api/auth/callback/google
   https://your-production-url.vercel.app/api/auth/callback/google
   ```

### 4. Generate AUTH_SECRET

Run this command to generate a secure secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 5. Test the Deployment

After setting up the environment variables:
1. Trigger a new deployment by pushing to your branch
2. Check the deployment logs for any errors
3. Test the login functionality on the preview URL

## Troubleshooting

- **500 Error**: Check that all environment variables are set correctly
- **OAuth Error**: Verify Google OAuth redirect URIs include your Vercel URLs
- **Database Error**: The app now uses in-memory database for serverless environments 