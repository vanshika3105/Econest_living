import express from 'express';
import { createOrder, getUserOrders, getAllOrders } from '../controllers/order.controller.js';
import { verifyFirebaseToken } from './firebase-auth.routes.js';

const router = express.Router();

router.use(verifyFirebaseToken);

router.post('/', createOrder);
router.get('/', getUserOrders);
router.get('/all', getAllOrders);

export default router;
