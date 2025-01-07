const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true }, // Unique username
        email: { type: String, required: true, unique: true }, // Unique email
        password: { type: String, required: true }, // Hashed password,
        adminAccess :{type: Boolean, default: false},
        profilePicture: {
            type: String,
            default: "https://example.com/default-profile-picture.png", // Default profile picture URL
        },
        ecoPoints: { type: Number, default: 1000 }, // Reward points
        transactions: [
            { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }, // References to transactions
        ],
        rewardsRedeemedHistory: [
            { type: mongoose.Schema.Types.ObjectId, ref: "RedeemedReward" }, // References to redeemed rewards
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
