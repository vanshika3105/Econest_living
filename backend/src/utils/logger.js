import { AuditLog } from '../models/AuditLog.js';

/**
 * Creates an audit log entry in the database.
 * Does not block the main execution flow (non-blocking).
 */
export const logSecurityEvent = async (action, req, details = {}) => {
  try {
    const userId = req.mongoUser?._id || req.user?.uid || 'GUEST';
    
    await AuditLog.create({
      action,
      userId,
      details,
      ip: req.ip || req.headers['x-forwarded-for'],
      userAgent: req.headers['user-agent'],
    });
  } catch (error) {
    // We don't want to crash the app if logging fails, but we should know about it
    console.error('Audit Logging Error:', error.message);
  }
};
