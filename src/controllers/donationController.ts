import { Request, Response } from 'express';
import * as donationModel from '../models/donationModel';

export const recordDonation = async (req: Request, res: Response): Promise<void> => {
    const { guestId, donationType, amount, donorName, donorMessage } = req.body;

    if (!donationType || !amount || amount < 0) {
        res.status(400).json({ error: 'Invalid donation type or amount.' });
        return;
    }
    if (donationType === 'Lua de Mel' && amount < 100) {
        res.status(400).json({ error: 'Minimum donation for honeymoon is R$100.' });
        return;
    }

    try {
        const newDonation = await donationModel.createDonation(guestId, donationType, amount, donorName, donorMessage);
        res.status(201).json({ message: 'Donation recorded successfully!', donation: newDonation });
    } catch (error) {
        console.error('Error recording donation:', error);
        res.status(500).json({ error: 'Internal server error recording donation.' });
    }
};