import express from 'express';
import { getUsers, getUserById, updateUser, deleteUser } from '../controllers/user.controller.js';
import { verifyToken, adminOnly, selfOrAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get all users - Admin Only
router.get('/', verifyToken, adminOnly, getUsers);

// Get a user by ID - Must be self or admin
router.get('/:id', verifyToken, selfOrAdmin, getUserById);

// Update a user - Must be self or admin
router.put('/:id', verifyToken, selfOrAdmin, updateUser);

// Delete a user - Must be self or admin
router.delete('/:id', verifyToken, selfOrAdmin, deleteUser);

export default router;
