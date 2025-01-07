const express = require("express");
const router = express.Router();
const { signup, login, googleAuth } = require("../../controllers/auth/auth");
const {userRegisterLogin} = require('../../config/getGoogleAuthToken');

// Routes beginning with /api/auth
router.post("/signup", signup);
router.post("/login", login);
router.get("/", googleAuth);
router.get("/redirect", userRegisterLogin);

module.exports = router;