import express from 'express';
import { getUserRentals, renewRental, endRental, createRental } from '../controllers/rental.controller.js';
import { verifyFirebaseToken } from './firebase-auth.routes.js';

const router = express.Router();

router.get('/', verifyFirebaseToken, getUserRentals);
router.post('/', verifyFirebaseToken, createRental);
router.post('/:id/renew', renewRental);
router.post('/:id/end', endRental);

export default router;
