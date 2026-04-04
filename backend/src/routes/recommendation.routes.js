import express from 'express';
import { getRecommendations } from '../controllers/recommendation.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(verifyToken);

router.get('/', getRecommendations);

export default router;
