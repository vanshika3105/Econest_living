import express from 'express';
import { AuditLog } from '../models/AuditLog.js';
import { verifyToken, adminOnly } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get all audit logs (Admin Only)
router.get('/logs', verifyToken, adminOnly, async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .sort({ timestamp: -1 })
      .limit(100); // Only show the last 100 logs for performance
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch security logs' });
  }
});

// Get security stats summary (Admin Only)
router.get('/stats', verifyToken, adminOnly, async (req, res) => {
  try {
    const totalLogs = await AuditLog.countDocuments();
    const loginCount = await AuditLog.countDocuments({ action: 'LOGIN' });
    const criticalActions = await AuditLog.countDocuments({ 
      action: { $in: ['ROLE_CHANGE', 'USER_DELETE', 'ADMIN_ACTION'] } 
    });
    
    res.json({ totalLogs, loginCount, criticalActions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch security stats' });
  }
});

export default router;
