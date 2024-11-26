const mongoose = require('mongoose');

const rewardItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    ecoPointsRequired: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    image: {
        type: String,
        default: "https://example.com/default-reward-image.png"
    },
}, { timestamps: true });

module.exports = mongoose.model('RewardItem', rewardItemSchema);
