import express from 'express';
import { createReview, getLandlordReviews } from '../controllers/review.controller.js';
import { protectRoute, authorizeRole } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', protectRoute, authorizeRole('student'), createReview);
router.get('/:landlordId', getLandlordReviews);

export default router;