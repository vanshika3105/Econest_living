import express from 'express';
import { getRecommendations } from '../controllers/recommendation.controller.js';

const router = express.Router();

router.get('/', getRecommendations);

export default router;
