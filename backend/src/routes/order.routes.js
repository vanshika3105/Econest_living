import express from 'express';
import { createOrder, getUserOrders, getAllOrders } from '../controllers/order.controller.js';
import { verifyToken, adminOnly } from '../middleware/auth.middleware.js';

const router = express.Router();

// General protection for all order routes
router.use(verifyToken);

// Customer can create their own order
router.post('/', createOrder);

// Customer can view their own orders
router.get('/', getUserOrders);

// ADMIN ONLY - View all system orders
router.get('/all', adminOnly, getAllOrders);

export default router;
