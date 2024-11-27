const express = require('express');
const router = express.Router({ mergeParams: true });

router.use('/auth', require('./auth'));
// router.use('/profile', require('./profile'));

module.exports = router;