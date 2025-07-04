import express, { Router } from 'express';
import * as guestController from '../controllers/guestController';

const router: Router = express.Router(); // Router do Express

// Rota para confirmar presença (POST /api/guests/confirm)
router.post('/confirm', guestController.confirmPresence);

// Rota para listar convidados confirmados (GET /api/guests/confirmed)
router.get('/confirmed', guestController.getConfirmedGuests);

// Rota para listar convidados NÃO confirmados (GET /api/guests/unconfirmed)
router.get('/unconfirmed', guestController.getUnconfirmedGuests);

export default router;
