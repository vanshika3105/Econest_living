import express from 'express';
import { trackActivity, getUserDashboard, getAdminStats } from '../controllers/crm.controller.js';
import { verifyToken, adminOnly } from '../middleware/auth.middleware.js';

const router = express.Router();

// Publicly trackable events (with optional token) OR strictly verify to prevent spam?
// Let's require auth for activity tracking to avoid spoofed analytics
router.post('/track', verifyToken, trackActivity);

// User-specific dashboard showing loyalty points/carbon offset
router.get('/dashboard', verifyToken, getUserDashboard);

// Admin-only stats for the entire platform
router.get('/admin/stats', verifyToken, adminOnly, getAdminStats);

export default router;
