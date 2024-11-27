const express = require('express');
const { body, param } = require('express-validator');
const multer = require('multer');
const { authenticate, authorize } = require('../middlewares/auth');
const { validate } = require('../middlewares/validation');
const RewardController = require('../controllers/rewardController');

class RewardRoutes {
    constructor() {
        this.router = express.Router();
        this.upload = multer({ 
            limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
            fileFilter: this.fileFilter 
        });
        this.initRoutes();
    }

    fileFilter = (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only images are allowed.'), false);
        }
    }

    initRoutes() {
        // Create Reward Item
        this.router.post('/', 
            authenticate,
            authorize('admin'),
            this.upload.single('image'),
            [
                body('name').trim().notEmpty().withMessage('Reward name is required'),
                body('points').isInt({ min: 1 }).withMessage('Points must be a positive integer'),
                body('description').optional().trim()
            ],
            validate,
            RewardController.createRewardItem
        );

        // Get All Reward Items
        this.router.get('/all', 
            RewardController.getAllRewardItems
        );

        // Activate/Deactivate Reward Item
        this.router.patch('/:action(activate|deactivate)/:rewardItemId', 
            authenticate,
            authorize('admin'),
            param('rewardItemId').isMongoId().withMessage('Invalid Reward Item ID'),
            param('action').isIn(['activate', 'deactivate']).withMessage('Invalid action'),
            validate,
            RewardController.toggleRewardItemStatus
        );

        // Get Reward Item by ID
        this.router.get('/:rewardItemId', 
            param('rewardItemId').isMongoId().withMessage('Invalid Reward Item ID'),
            validate,
            RewardController.getRewardItemById
        );
    }

    getRouter() {
        return this.router;
    }
}

module.exports = new RewardRoutes().getRouter();