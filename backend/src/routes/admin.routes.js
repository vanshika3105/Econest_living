import express from 'express';
import { verifyToken, adminOnly } from '../middleware/auth.middleware.js';
import {
  // Live Tracking
  getAdminOrders,
  updateOrderStatus,
  addOrderNotes,
  getLiveTrackingOrders,
  // Business Controls
  updateUserRole,
  deleteUser,
  updateProductStatus,
  updateProductStock,
  adminDeleteProduct,
  getBusinessDashboard,
  // SCM
  getSCMOverview,
  createPurchaseOrder,
  updatePurchaseOrderStatus,
  getInventoryAlerts,
  resolveAlert,
  getReviewAnalysis
} from '../controllers/admin.controller.js';

const router = express.Router();

// All admin routes require auth + admin role
router.use(verifyToken, adminOnly);

// ── Live Tracking ─────────────────────────────────────
router.get('/orders', getAdminOrders);
router.get('/orders/live', getLiveTrackingOrders);
router.put('/orders/:orderId/status', updateOrderStatus);
router.put('/orders/:orderId/notes', addOrderNotes);

// ── Business Dashboard ────────────────────────────────
router.get('/dashboard', getBusinessDashboard);

// ── User Management ───────────────────────────────────
router.put('/users/:userId/role', updateUserRole);
router.delete('/users/:userId', deleteUser);

// ── Product Management ────────────────────────────────
router.put('/products/:productId/status', updateProductStatus);
router.put('/products/:productId/stock', updateProductStock);
router.delete('/products/:productId', adminDeleteProduct);

// ── SCM ───────────────────────────────────────────────
router.get('/scm/overview', getSCMOverview);
router.post('/scm/purchase-orders', createPurchaseOrder);
router.put('/scm/purchase-orders/:poId/status', updatePurchaseOrderStatus);
router.get('/scm/alerts', getInventoryAlerts);
router.put('/scm/alerts/:alertId/resolve', resolveAlert);

// ── CRM Analysis ──────────────────────────────────────
router.get('/crm/reviews-analysis', getReviewAnalysis);

export default router;
