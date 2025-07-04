import { Request, Response } from 'express';
import * as guestModel from '../models/guestModel';

// Confirma a presença de um convidado
export const confirmPresence = async (req: Request, res: Response): Promise<void> => {
    const { fullName, email, numCompanions, message } = req.body;

    // Validação básica (pode ser mais robusta com Joi/Yup)
    if (!fullName) {
        res.status(400).json({ error: 'Full name is required.' });
        return;
    }

    try {
        const newGuest = await guestModel.createGuest(fullName, email, numCompanions, message);
        res.status(201).json({ message: 'Presence confirmed successfully!', guest: newGuest });
    } catch (error) {
        console.error('Error confirming presence:', error);
        res.status(500).json({ error: 'Internal server error confirming presence.' });
    }
};

export const getConfirmedGuests = async (req: Request, res: Response): Promise<void> => {
    try {
        const confirmedGuests = await guestModel.findConfirmedGuests();
        res.status(200).json(confirmedGuests);
    } catch (error) {
        console.error('Error fetching confirmed guests:', error);
        res.status(500).json({ error: 'Internal server error fetching guests.' });
    }
};

export const getUnconfirmedGuests = async (req: Request, res: Response): Promise<void> => {
    try {
        const unconfirmedGuests = await guestModel.findUnconfirmedGuests();
        res.status(200).json(unconfirmedGuests);
    } catch (error) {
        console.error('Error fetching unconfirmed guests:', error);
        res.status(500).json({ error: 'Internal server error fetching unconfirmed guests.' });
    }
};
