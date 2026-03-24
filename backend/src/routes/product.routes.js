import express from 'express';
import { verifyFirebaseToken } from './firebase-auth.routes.js';
import {
  createProduct,
  getVendorProducts,
  getAllProducts,
  deleteProduct,
} from '../controllers/product.controller.js';

const router = express.Router();

// Public — all active products (customer shop)
router.get('/', getAllProducts);

// Protected — vendor's own products
router.get('/mine', verifyFirebaseToken, getVendorProducts);

// Protected — create product
router.post('/', verifyFirebaseToken, createProduct);

// Protected — delete a product (owner only)
router.delete('/:id', verifyFirebaseToken, deleteProduct);

export default router;
