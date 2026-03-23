import { User } from '../models/User.js';
import admin from '../config/firebase-admin.js';

// Verify existing firebase user or login
export const verify = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(401).json({ error: 'No token provided' });

    const decodedToken = await admin.auth().verifyIdToken(token);
    const email = decodedToken.email;

    let user = await User.findOne({ email });
    if (!user) {
      // Auto-create if not found but valid in firebase
      user = await User.create({
        name: decodedToken.name || email.split('@')[0],
        email: email,
        password: 'firebase-managed', // dummy password since model requires it
        role: 'customer'
      });
    }

    res.json({
      message: 'Verified successful',
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
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
    
    // Verify token
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    const { name, email, role } = req.body;
    
    // Ensure the token email matches the request
    if (decodedToken.email !== email) {
      return res.status(403).json({ error: 'Token email does not match' });
    }

    let user = await User.findOne({ email });
    if (user) {
      // Update existing
      user.name = name || user.name;
      user.role = role || user.role;
      await user.save();
    } else {
      user = await User.create({ 
        name, 
        email, 
        password: 'firebase-managed', 
        role: role || 'customer' 
      });
    }

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
