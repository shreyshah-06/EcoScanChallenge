const express = require('express');
const { getUserAuthUrl } = require('../../config/oauthConfig');
const { handleUserCallback } = require('../../controllers/auth/userAuthController');

const router = express.Router({ mergeParams: true });

// Redirects users to Google's OAuth consent screen
router.get('/', (req, res) => {
  try {
    const authUrl = getUserAuthUrl(); // Generate Google OAuth URL
    res.redirect(authUrl); // Redirect the user to Google OAuth consent screen
  } catch (error) {
    console.error("Error generating Google Auth URL:", error.message);
    res.status(500).json({ 
      error: "Failed to generate authentication URL.",
      details: error.message 
    });
  }
});

// Handles the redirect after user grants permission
router.get('/callback', handleUserCallback);

module.exports = router;