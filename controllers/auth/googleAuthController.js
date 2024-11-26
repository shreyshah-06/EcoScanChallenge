const User = require("../../models/User");
const generateJwtToken = require("../../config/generateJWT");
const { oauth2ClientUser } = require("../../config/oauthConfig");
const axios = require("axios");
const asyncHandler = require("../../middlewares/asyncHandler");

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v1/userinfo";

// Get authentication URL
exports.getGoogleAuthUrl = (req, res) => {
  try {
    const authorizationUrl = oauth2ClientUser.generateAuthUrl({
      access_type: 'offline',
      scope: ['email', 'profile'],
      include_granted_scopes: true
    });
    res.json({ authUrl: authorizationUrl });
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to generate authentication URL", 
      error: error.message 
    });
  }
};

// Handle user registration/login
exports.handleGoogleCallback = asyncHandler(async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ message: "Authorization code is required" });
    }

    // Exchange authorization code for tokens
    const { tokens } = await oauth2ClientUser.getToken(code);
    oauth2ClientUser.setCredentials(tokens);

    // Fetch user information
    const userInfoResponse = await axios.get(GOOGLE_USERINFO_URL, {
      headers: { Authorization: `Bearer ${tokens.access_token}` }
    });
    const googleUser = userInfoResponse.data;

    // Find or create user
    let user = await User.findOne({ email: googleUser.email });

    if (!user) {
      user = await User.create({
        name: googleUser.name,
        username: generateUsername(googleUser),
        email: googleUser.email,
        profilePicture: googleUser.picture || null,
        adminAccess: false // Default to non-admin
      });
    }

    // Generate JWT token
    const token = generateJwtToken({ 
      id: user._id, 
      adminAccess: user.adminAccess,
      email: user.email 
    });

    // Redirect with token
    return res.redirect(
      `${process.env.FRONTEND_URI}/auth/token?code=${token}`
    );

  } catch (error) {
    console.error('Google Authentication Error:', error);
    return res.status(500).json({ 
      message: "Authentication failed", 
      error: error.message 
    });
  }
});

// Username generation utility
function generateUsername(googleUser) {
  const baseUsername = googleUser.given_name 
    ? googleUser.given_name 
    : googleUser.name.split(" ")[0];
  
  return `${baseUsername}_${Date.now()}`.toLowerCase();
}

// Logout handler
exports.logout = (req, res) => {
  try {
    // Clear any server-side session if applicable
    // Invalidate tokens if you're storing them

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ 
      message: "Logout failed", 
      error: error.message 
    });
  }
};