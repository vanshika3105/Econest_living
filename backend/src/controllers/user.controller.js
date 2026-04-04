import { User } from '../models/User.js';
import { logSecurityEvent } from '../utils/logger.js';

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a user
export const updateUser = async (req, res) => {
  try {
    const { role, ecoScore, loyaltyPoints, loyaltyTier, totalCarbonSaved, ...updateData } = req.body;
    
    if (role && req.mongoUser.role !== 'admin') {
        return res.status(403).json({ error: 'You are not authorized to change the user role' });
    }

    const updates = req.mongoUser.role === 'admin' ? req.body : updateData;

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (role) {
        logSecurityEvent('ROLE_CHANGE', req, { targetUserId: user._id, newRole: role });
    }

    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    logSecurityEvent('USER_DELETE', req, { targetUserId: req.params.id, email: user.email });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
