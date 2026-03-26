import express from 'express';
import { trackActivity, getUserDashboard, getAdminStats } from '../controllers/crm.controller.js';

const router = express.Router();

// Middleware for auth can be applied here or in server.js
// Fake a simple auth middleware for these routes if needed, assuming it's injected before or handled in components
router.post('/track', trackActivity);
router.get('/dashboard', getUserDashboard); // Need auth
router.get('/admin/stats', getAdminStats); // Need admin auth

export default router;
