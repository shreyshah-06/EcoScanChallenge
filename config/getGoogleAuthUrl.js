require("dotenv").config();

const { google } = require("googleapis");

const oauth2ClientUser = new google.auth.OAuth2(
  process.env.OAUTH_CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.USER_AUTH_REDIRECT_URI
);

const scopes = ["email", "profile"];

exports.getUserURL = () => {
  const authorizationUrl = oauth2ClientUser.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    include_granted_scopes: true,
  });
  return authorizationUrl;
};
