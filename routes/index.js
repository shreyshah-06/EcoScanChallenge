const express = require('express');
const router = express.Router();
const authRoutes = require('./user/auth')

// router.use('/user',require('./user'));
// router.use('/transaction');
// router.use('/reward');
router.use("/auth", authRoutes); 

module.exports = router;