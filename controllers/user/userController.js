const mongoose = require('mongoose');
const asyncHandler = require('../middleware/asyncHandler');
const User = require('../models/User');
const ErrorResponse = require('../utils/ErrorResponse');

class UserDataService {
    static async fetchUserData(query, lookupOptions = {}) {
        const basePipeline = [
            { $match: query },
            {
                $lookup: {
                    from: 'transactions',
                    localField: 'transactions',
                    foreignField: '_id',
                    as: 'transactionDetails'
                }
            },
            {
                $lookup: {
                    from: 'redeemedrewards',
                    localField: 'rewardsRedeemedHistory',
                    foreignField: '_id',
                    as: 'rewardDetails'
                }
            },
            {
                $addFields: {
                    totalTransactions: { $size: '$transactionDetails' },
                    totalRewards: { $size: '$rewardDetails' }
                }
            },
            {
                $project: {
                    username: 1,
                    email: 1,
                    ecoPoints: 1,
                    adminAccess: 1,
                    profilePicture: 1,
                    transactionDetails: 1,
                    rewardDetails: 1,
                    totalTransactions: 1,
                    totalRewards: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            }
        ];

        // Add any additional lookup stages if provided
        if (lookupOptions.additionalLookups) {
            basePipeline.splice(-2, 0, ...lookupOptions.additionalLookups);
        }

        const [userData] = await User.aggregate(basePipeline);
        return userData || null;
    }

    static async getUserById(userId) {
        return this.fetchUserData({ _id: mongoose.Types.ObjectId(userId) });
    }

    static async getUserByUsername(username) {
        return this.fetchUserData({ username });
    }
}

// Controller methods
exports.getUserProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const userData = await UserDataService.getUserById(userId);

    if (!userData) {
        throw new ErrorResponse('User not found', 404);
    }

    res.status(200).json({
        success: true,
        data: userData
    });
});

// Validation middleware
exports.validateUserQuery = (queryType) => [
    param(queryType).custom(async (value, { req }) => {
        const userData = queryType === 'userId' 
            ? await UserDataService.getUserById(value)
            : await UserDataService.getUserByUsername(value);

        if (!userData) {
            throw new ErrorResponse('User not found', 404);
        }

        req.userData = userData;
        return true;
    })
];