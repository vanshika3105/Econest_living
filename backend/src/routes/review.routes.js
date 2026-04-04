import express from 'express';
import { createReview, getProductReviews, getAllReviews } from '../controllers/review.controller.js';
import { verifyToken, adminOnly } from '../middleware/auth.middleware.js';

const router = express.Router();

// ADMIN ONLY route to get all reviews
router.get('/all', verifyToken, adminOnly, getAllReviews);

// Public route to get reviews (Customers browsing products)
router.get('/:productId', getProductReviews);

// Protected route to add a review
router.post('/', verifyToken, createReview);

export default router;
