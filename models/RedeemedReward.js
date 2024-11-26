const mongoose = require('mongoose');

const redeemedRewardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rewardItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'RewardItem', required: true },
  redeemedOn: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('RedeemedReward', redeemedRewardSchema);
