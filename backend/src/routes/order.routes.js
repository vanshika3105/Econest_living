import express from 'express';
import { createOrder, getUserOrders } from '../controllers/order.controller.js';
import { verifyFirebaseToken } from './firebase-auth.routes.js';

const router = express.Router();

router.use(verifyFirebaseToken);

router.post('/', createOrder);
router.get('/', getUserOrders);

export default router;
