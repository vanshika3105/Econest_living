import express from 'express';
import { createReview, getProductReviews, getAllReviews } from '../controllers/review.controller.js';
import { verifyFirebaseToken } from './firebase-auth.routes.js';

const router = express.Router();

// Admin route to get all reviews
router.get('/all', verifyFirebaseToken, getAllReviews);

// Public route to get reviews 
router.get('/:productId', getProductReviews);

// Protected route to add a review
router.post('/', verifyFirebaseToken, createReview);

export default router;
