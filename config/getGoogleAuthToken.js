const User = require("../models/User");
const generateJwtToken = require("../config/generateJWT");
const axios = require("axios");
require("dotenv").config();

exports.userRegisterLogin = async (req, res) => {
  try {
    const url = "https://oauth2.googleapis.com/token";
    const values = {
      code: req.query.code,
      client_id: process.env.OAUTH_CLIENT_ID,
      client_secret: process.env.OAUTH_CLIENT_SECRET,
      redirect_uri: `${process.env.API_URI}/auth/redirect`,
      grant_type: "authorization_code",
    };
  
    const qs = new URLSearchParams(values);
  
    const { id_token, access_token } = await axios
      .post(url, qs.toString(), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((res) => res.data)
      .catch((error) => {
        return res.json({ message: error.message });
      });
  
    const googleUser = await axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
        {
          headers: {
            Authorization: `Bearer ${id_token}`,
          },
        }
      )
      .then((res) => res.data)
      .catch((error) => {
        return res.json({ message: error.message });
      });
  
    const user_exist = await User.findOne({ email: googleUser.email });
  
    if (user_exist) {
      const token = generateJwtToken({ id: user_exist._id});
  
    //   return res.redirect(process.env.FRONTEND_URI + `/auth/token?code=${token}`);
      return res.json({ message: "User Logged in", data: token });
    }
    
    const user = await User.create({
      name: googleUser.name,
      email: googleUser.email,
      password : "asdasd@12343#",
      profilePicture: googleUser.picture
    });
    
    const token = generateJwtToken({ id: user._id});
    
    
    // return res.redirect(process.env.FRONTEND_URI + `/auth/token?code=${token}`);
    return res.json({ message: "User Registered", data: token });
  } catch (error) {
    console.log(error);
  }
 
};