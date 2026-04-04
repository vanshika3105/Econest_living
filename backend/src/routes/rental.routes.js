import express from 'express';
import { getUserRentals, renewRental, endRental, createRental } from '../controllers/rental.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(verifyToken);

router.get('/', getUserRentals);
router.post('/', createRental);
router.post('/:id/renew', renewRental);
router.post('/:id/end', endRental);

export default router;
