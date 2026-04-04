import { User } from '../models/User.js';
import admin from '../config/firebase-admin.js';
import { logSecurityEvent } from '../utils/logger.js';

// Verify existing firebase user or login
export const verify = async (req, res) => {
  try {
    // ... same token logic ...
    let token = req.body.token;
    const authHeader = req.headers.authorization;
    if (!token && authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
    if (!token) return res.status(401).json({ error: 'No token provided' });

    const decodedToken = await admin.auth().verifyIdToken(token);
    const email = decodedToken.email;

    const user = await User.findOneAndUpdate(
      { email },
      {
        $setOnInsert: {
          name: decodedToken.name || email.split('@')[0],
          password: 'firebase-managed', 
          role: 'customer'
        }
      },
      { new: true, upsert: true, runValidators: true }
    );

    // LOG SECURITY EVENT
    logSecurityEvent('LOGIN', req, { email: user.email, role: user.role });

    res.json({
      message: 'Verified successful',
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(401).json({ error: 'Invalid token: ' + error.message });
  }
};

// Register via Firebase
export const registerFirebase = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    const { name, email, role } = req.body;
    if (decodedToken.email !== email) return res.status(403).json({ error: 'Token email does not match' });

    let assignedRole = 'customer';
    if (role === 'supplier') assignedRole = 'supplier';
    if (role === 'admin') return res.status(403).json({ error: 'Admin role cannot be self-assigned' });

    let user = await User.findOne({ email });
    if (user) {
      user.name = name || user.name;
      await user.save();
    } else {
      user = await User.create({ name, email, password: 'firebase-managed', role: assignedRole });
    }

    // LOG SECURITY EVENT
    logSecurityEvent('REGISTER', req, { email: user.email, role: user.role });

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
