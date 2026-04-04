import express from 'express';
import admin from 'firebase-admin';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// The original verifyFirebaseToken is now replaced by verifyToken from middleware
// We keep the export if other files still import it, but redirect it to verifyToken
export const verifyFirebaseToken = verifyToken;

// Verify Firebase token endpoint
router.post('/verify', verifyFirebaseToken, (req, res) => {
  res.json({
    message: 'Token verified',
    user: {
      uid: req.user.uid,
      email: req.user.email,
      name: req.user.name,
    },
  });
});

// Get user profile
router.get('/profile', verifyFirebaseToken, async (req, res) => {
  try {
    const userRecord = await admin.auth().getUser(req.user.uid);
    res.json({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      photoURL: userRecord.photoURL,
      createdAt: userRecord.metadata.creationTime,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
