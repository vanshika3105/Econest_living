import express from 'express';
import { registerFirebase, verify } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register-firebase', registerFirebase);
router.post('/verify', verify);

export default router;
