import { User } from '../models/User.js';
import admin from '../config/firebase-admin.js';

// Verify existing firebase user or login
export const verify = async (req, res) => {
  try {
    // Try to get token from body or headers
    let token = req.body.token;
    const authHeader = req.headers.authorization;
    if (!token && authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) return res.status(401).json({ error: 'No token provided' });

    const decodedToken = await admin.auth().verifyIdToken(token);
    const email = decodedToken.email;

    // Use findOneAndUpdate with upsert to prevent race conditions from concurrent calls
    const user = await User.findOneAndUpdate(
      { email },
      {
        $setOnInsert: {
          name: decodedToken.name || email.split('@')[0],
          password: 'firebase-managed', // dummy password since model requires it
          role: 'customer'
        }
      },
      { new: true, upsert: true, runValidators: true }
    );

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
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Database indicates email is already in use' });
    }
    res.status(500).json({ error: error.message });
  }
};
