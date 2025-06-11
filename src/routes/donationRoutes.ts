import express, { Router } from 'express';
import * as donationController from '../controllers/donationController';

const router: Router = express.Router();

// Rota para registrar uma doação (POST /api/donations/record)
router.post('/record', donationController.recordDonation);

export default router;