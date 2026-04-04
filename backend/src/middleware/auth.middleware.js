import admin from 'firebase-admin';
import { User } from '../models/User.js';

// Middleware to verify Firebase token
export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split('Bearer ')[1] : null;

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Attach the user information from Firebase
    req.user = decodedToken;

    // Fetch user from MongoDB to check role/EcoScore
    const mongoUser = await User.findOne({ email: decodedToken.email });
    if (mongoUser) {
        req.mongoUser = mongoUser;
    }

    next();
  } catch (error) {
    console.error('Auth verification error:', error.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Check if user is Admin
export const adminOnly = (req, res, next) => {
    if (!req.mongoUser || req.mongoUser.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied: Admin only' });
    }
    next();
};

// Check if user is Supplier/Vendor or Admin
export const supplierOrAdmin = (req, res, next) => {
    if (!req.mongoUser || (req.mongoUser.role !== 'supplier' && req.mongoUser.role !== 'admin')) {
        return res.status(403).json({ error: 'Access denied: Supplier or Admin only' });
    }
    next();
};

// Check if user is self (for updates/deletes) or Admin
export const selfOrAdmin = (req, res, next) => {
    const requestedId = req.params.id;
    if (!req.mongoUser) {
        return res.status(403).json({ error: 'User context not found' });
    }

    if (req.mongoUser._id.toString() !== requestedId && req.mongoUser.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied: Unauthorized access to this record' });
    }
    next();
};

// Generic role-based check
export const authorize = (roles = []) => {
    return (req, res, next) => {
        if (!req.mongoUser || !roles.includes(req.mongoUser.role)) {
            return res.status(403).json({ error: `Access denied: Requires one of these roles: ${roles.join(', ')}` });
        }
        next();
    };
};
