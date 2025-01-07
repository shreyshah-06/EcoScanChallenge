const mongoose = require("mongoose");

exports.validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

exports.validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    return passwordRegex.test(password);
};

exports.isValidImageType = (image) => {
    const imageRegex = /\.(jpg|jpeg|png|gif)$/i; // Regular expression to check file extension
    return imageRegex.test(image);
};

exports.validateObjectId = (string) => {
    return mongoose.Types.ObjectId.isValid(string);
}