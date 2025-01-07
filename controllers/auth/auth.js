const User = require("../../models/User");
const bcrypt = require("bcrypt");
const {validateEmail, validatePassword} = require('../../utils/validation');
const { createAccessToken } = require("../../utils/token");
const {getUserURL} = require('../../config/getGoogleAuthUrl');

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Validate email format using the imported function
    if (!validateEmail(email)) {
      return res.status(400).json({ msg: "Please provide a valid email address." });
    }

    // Validate password strength using the imported function
    if (!validatePassword(password)) {
      return res.status(400).json({ msg: "Password must be at least 8 characters long and include a number and a special character." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "This email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ name, email, password: hashedPassword });
    res.status(201).json({ msg: "Account created successfully", user: { name: newUser.name, email: newUser.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "This email is not registered" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Password incorrect" });

    const token = createAccessToken({ id: user._id });
    res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, profilePicture:user.profilePicture },
      msg: "Login successful",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const googleAuth = async(req, res) => {
  const url = getUserURL();
  res.redirect(url);
};

module.exports = {
    login,
    signup,
    googleAuth
}
