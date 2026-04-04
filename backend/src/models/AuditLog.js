import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: ['LOGIN', 'REGISTER', 'ORDER_CREATE', 'RENTAL_CREATE', 'PRODUCT_CREATE', 'ROLE_CHANGE', 'USER_DELETE', 'PRODUCT_DELETE', 'ADMIN_ACTION'],
  },
  userId: {
    type: String, // Firebase UID or Mongo ID
    required: true,
  },
  details: {
    type: Object,
    default: {},
  },
  ip: String,
  userAgent: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export const AuditLog = mongoose.model('AuditLog', auditLogSchema);
