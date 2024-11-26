const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateJwtToken = (payload) => {
  if (!payload.id) {
    throw new Error('User ID is required for token generation');
  }

  // Token configuration
  return jwt.sign(
    {
      id: payload.id,
      adminAccess: payload.adminAccess || false,
      email: payload.email
    }, 
    process.env.JWT_SECRET, 
    { 
      expiresIn: process.env.JWT_EXPIRATION || '7d' 
    }
  );
};

module.exports = generateJwtToken;