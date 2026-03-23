import express from 'express';
import { getCart, updateCart } from '../controllers/cart.controller.js';
import { verifyFirebaseToken } from './firebase-auth.routes.js';

const router = express.Router();

router.use(verifyFirebaseToken);

router.get('/', getCart);
router.post('/', updateCart);

export default router;
