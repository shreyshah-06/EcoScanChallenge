const express = require('express');
const { getUserAuthUrl } = require('../../config/oauthConfig');
const { handleGoogleCallback } = require('../../controllers/auth/googleAuthController');
const multer = require('multer');
const { fileUpload } = require('../../config/firebaseConfig');
const router = express.Router({ mergeParams: true });
const upload = multer();

// Redirects users to Google's OAuth consent screen
router.get('/', (req, res) => {
  try {
    console.log('here');
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
router.get('/callback', handleGoogleCallback);

router.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file; // The uploaded file
  const filename = file.originalname; // Get the file's original name

  // Call your file upload function
  const file_url = fileUpload(file, filename);

  // Respond with the file URL
  res.json({ file_url });
});

module.exports = router;