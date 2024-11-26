const mongoose = require("mongoose");

const dbConnect = async (URL) => {
    await mongoose.connect(URL, {})
    console.log('Connected to Database');
}

module.exports = dbConnect;