import express from 'express';
import { createCustomizationRequest, getMyCustomizations, analyzeRequest, customizeProduct, getAdminCustomizations } from '../controllers/customization.controller.js';
import { verifyFirebaseToken } from './firebase-auth.routes.js';
import { checkCustomizationAccess } from '../middleware/customization.middleware.js';

const router = express.Router();

// User routes - protected by firebase token
router.post('/', verifyFirebaseToken, checkCustomizationAccess, createCustomizationRequest);
router.post('/customize', verifyFirebaseToken, checkCustomizationAccess, customizeProduct);
router.get('/', verifyFirebaseToken, getMyCustomizations);

// Admin/Vendor routes
router.get('/admin', verifyFirebaseToken, getAdminCustomizations);

// Analysis (could be triggered by user or auto-processed)
router.post('/:id/analyze', verifyFirebaseToken, analyzeRequest);

export default router;
