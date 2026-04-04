import express from 'express';
import { getCart, updateCart } from '../controllers/cart.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(verifyToken);

router.get('/', getCart);
router.post('/', updateCart);

export default router;
