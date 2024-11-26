const { google } = require('googleapis');
require('dotenv').config();

// Fixed scopes for email and profile
const SCOPES = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile'
];

// Create OAuth2 client with error handling and simplified approach
const createOAuthClient = (redirectUri) => {
  // Validate required environment variables
  if (!process.env.OAUTH_CLIENT_ID || !process.env.CLIENT_SECRET) {
    throw new Error('Missing OAuth configuration: Client ID or Secret');
  }

  return new google.auth.OAuth2(
    process.env.OAUTH_CLIENT_ID,
    process.env.CLIENT_SECRET,
    redirectUri
  );
};

// Create clients for admin and user authentication
const oauth2ClientAdmin = createOAuthClient(process.env.ADMIN_AUTH_REDIRECT_URI);
const oauth2ClientUser = createOAuthClient(process.env.USER_AUTH_REDIRECT_URI);

// Generate authentication URL with default configuration
const generateAuthUrl = (client) => {
  return client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    include_granted_scopes: true,
    prompt: 'consent'
  });
};

module.exports = {
  // Methods to get auth URLs
  getAdminAuthUrl: () => generateAuthUrl(oauth2ClientAdmin),
  getUserAuthUrl: () => generateAuthUrl(oauth2ClientUser)
};