import express from 'express';
import { body, validationResult } from 'express-validator';
import { verifyToken, supplierOrAdmin } from '../middleware/auth.middleware.js';
import {
  createProduct,
  getVendorProducts,
  getAllProducts,
  deleteProduct,
} from '../controllers/product.controller.js';

const router = express.Router();

// Middleware to handle validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Validation rules for product creation
const productValidation = [
  body('name').notEmpty().withMessage('Product name is required').trim().escape(),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('category').notEmpty().withMessage('Category is required').trim().escape(),
  body('stock').optional().isNumeric().withMessage('Stock must be a number'),
  body('ecoScore').optional().isNumeric().withMessage('EcoScore must be a number'),
];

// Public — all active products (customer shop)
router.get('/', getAllProducts);

// Protected — vendor's own products
router.get('/mine', verifyToken, supplierOrAdmin, getVendorProducts);

// Protected — create product (Vendor/Admin only + validation)
router.post('/', verifyToken, supplierOrAdmin, productValidation, validate, createProduct);

// Protected — delete a product (Owner/Admin only)
router.delete('/:id', verifyToken, supplierOrAdmin, deleteProduct);

export default router;
